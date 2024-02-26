import { o } from '../jsx/jsx.js'
import { Routes } from '../routes.js'
import { apiEndpointTitle, title } from '../../config.js'
import Style from '../components/style.js'
import { Context, DynamicContext, getContextFormBody } from '../context.js'
import { mapArray } from '../components/fragment.js'
import { dateString, object, string, timeString } from 'cast.ts'
import { Link, Redirect } from '../components/router.js'
import { renderError } from '../components/error.js'
import { getAuthUser } from '../auth/user.js'
import { proxy } from '../../../db/proxy.js'

let pageTitle = 'Timeslot'
let addPageTitle = 'Add Timeslot'

let style = Style(/* css */ `
#Timeslot {

}
`)

let page = (
  <>
    {style}
    <div id="Timeslot">
      <h1>{pageTitle}</h1>
      <p>See if it can still updates.</p>
      <Main />
    </div>
  </>
)

let items = [
  { title: 'Dev Workshop', date: '2024-02-26', starting_time: '19:00' },
]
items = proxy.timeslot

function Main(attrs: {}, context: Context) {
  let user = getAuthUser(context)
  return (
    <>
      <p>number of timeslots: {items.length}</p>
      <ul>
        {mapArray(items, item => (
          <li>
            {item.title} ({item.date} {item.starting_time})
          </li>
        ))}
      </ul>
      {user ? (
        <Link href="/timeslot/add">
          <button>{addPageTitle}</button>
        </Link>
      ) : (
        <p>
          You can add Timeslot after <Link href="/register">register</Link>.
        </p>
      )}
    </>
  )
}

let addPage = (
  <div id="AddTimeslot">
    {Style(/* css */ `
#AddTimeslot .field {
  margin-block-end: 1rem;
}
#AddTimeslot .field label input {
  display: block;
  margin-block-start: 0.25rem;
}
#AddTimeslot .field label .hint {
  display: block;
  margin-block-start: 0.25rem;
}
`)}
    <h1>{addPageTitle}</h1>
    <form
      method="POST"
      action="/timeslot/add/submit"
      onsubmit="emitForm(event)"
    >
      <div class="field">
        <label>
          Title*:
          <input name="title" required minlength="3" maxlength="50" />
          <p class="hint">(3-50 characters)</p>
        </label>
      </div>
      <div class="field">
        <label>
          Date*:
          <input name="date" type="date" required />
        </label>
      </div>
      <div class="field">
        <label>
          Starting Time*:
          <input name="starting_time" type="time" required />
        </label>
      </div>
      <input type="submit" value="Submit" />
      <p>
        Remark:
        <br />
        *: mandatory fields
      </p>
    </form>
  </div>
)

function AddPage(attrs: {}, context: DynamicContext) {
  let user = getAuthUser(context)
  if (!user) return <Redirect href="/login" />
  return addPage
}

let submitParser = object({
  title: string({ minLength: 3, maxLength: 50 }),
  date: dateString(),
  starting_time: timeString(),
})

function Submit(attrs: {}, context: DynamicContext) {
  try {
    let user = getAuthUser(context)
    if (!user) throw 'You must be logged in to submit ' + pageTitle
    let body = getContextFormBody(context)
    let input = submitParser.parse(body)
    // let input = body as any
    let id = items.push({
      title: input.title,
      date: input.date,
      starting_time: input.starting_time,
    })
    return <Redirect href={`/timeslot/result?id=${id}`} />
  } catch (error) {
    return (
      <Redirect
        href={
          '/timeslot/result?' + new URLSearchParams({ error: String(error) })
        }
      />
    )
  }
}

function SubmitResult(attrs: {}, context: DynamicContext) {
  let params = new URLSearchParams(context.routerMatch?.search)
  let error = params.get('error')
  let id = params.get('id')
  return (
    <div>
      {error ? (
        renderError(error, context)
      ) : (
        <>
          <p>Your submission is received (#{id}).</p>
          <p>
            Back to <Link href="/timeslot">{pageTitle}</Link>
          </p>
        </>
      )}
    </div>
  )
}

let routes: Routes = {
  '/timeslot': {
    title: title(pageTitle),
    description: 'TODO',
    menuText: pageTitle,
    node: page,
  },
  '/timeslot/add': {
    title: title(addPageTitle),
    description: 'TODO',
    node: <AddPage />,
    streaming: false,
  },
  '/timeslot/add/submit': {
    title: apiEndpointTitle,
    description: 'TODO',
    node: <Submit />,
    streaming: false,
  },
  '/timeslot/result': {
    title: apiEndpointTitle,
    description: 'TODO',
    node: <SubmitResult />,
    streaming: false,
  },
}

export default { routes }
