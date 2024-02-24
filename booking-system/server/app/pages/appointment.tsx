import { o } from '../jsx/jsx.js'
import { Routes } from '../routes.js'
import { apiEndpointTitle, title } from '../../config.js'
import Style from '../components/style.js'
import { Context, DynamicContext, getContextFormBody } from '../context.js'
import { mapArray } from '../components/fragment.js'
import { object, string } from 'cast.ts'
import { Link, Redirect } from '../components/router.js'
import { renderError } from '../components/error.js'
import { getAuthUser } from '../auth/user.js'
import { proxy } from '../../../db/proxy.js'

let pageTitle = 'Appointment'
let addPageTitle = 'Add Appointment'

let style = Style(/* css */ `
#Appointment {

}
`)

let page = (
  <>
    {style}
    <div id="Appointment">
      <h1>{pageTitle}</h1>
      <Main />
    </div>
  </>
)

let items = [
  { title: 'Android', slug: 'md' },
  { title: 'iOS', slug: 'ios' },
]

function Main(attrs: {}, context: Context) {
  let user = getAuthUser(context)
  if (!user || user.id != 1) {
    return <p>this page is only visible for admin</p>
  }
  return (
    <>
      <ol>
        {mapArray(proxy.appointment, appointment => (
          <li>
            <div>
              {appointment.name} ({appointment.email})
            </div>
            <p>{appointment.remark || '(no remark)'}</p>
            <div>
              {appointment.timeslot?.date} {appointment.timeslot?.from_time}-
              {appointment.timeslot?.to_time}
            </div>
            <b>{appointment.timeslot?.title}</b>
          </li>
        ))}
      </ol>
      {user ? (
        <Link href="/appointment/add">
          <button>{addPageTitle}</button>
        </Link>
      ) : (
        <p>
          You can add appointment after <Link href="/register">register</Link>.
        </p>
      )}
    </>
  )
}

let addPage = (
  <div id="AddAppointment">
    {Style(/* css */ `
#AddAppointment .field {
  margin-block-end: 1rem;
}
#AddAppointment .field label input {
  display: block;
  margin-block-start: 0.25rem;
}
#AddAppointment .field label .hint {
  display: block;
  margin-block-start: 0.25rem;
}
`)}
    <h1>{addPageTitle}</h1>
    <form
      method="POST"
      action="/appointment/add/submit"
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
          Slug*:
          <input
            name="slug"
            required
            placeholder="should be unique"
            pattern="(\w|-|\.){1,32}"
          />
          <p class="hint">
            (1-32 characters of: <code>a-z A-Z 0-9 - _ .</code>)
          </p>
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
  slug: string({ match: /^[\w-]{1,32}$/ }),
})

function Submit(attrs: {}, context: DynamicContext) {
  try {
    let user = getAuthUser(context)
    if (!user) throw 'You must be logged in to submit ' + pageTitle
    let body = getContextFormBody(context)
    let input = submitParser.parse(body)
    let id = items.push({
      title: input.title,
      slug: input.slug,
    })
    return <Redirect href={`/appointment/result?id=${id}`} />
  } catch (error) {
    return (
      <Redirect
        href={
          '/appointment/result?' + new URLSearchParams({ error: String(error) })
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
            Back to <Link href="/appointment">{pageTitle}</Link>
          </p>
        </>
      )}
    </div>
  )
}

let routes: Routes = {
  '/appointment': {
    title: title(pageTitle),
    description: 'TODO',
    menuText: pageTitle,
    node: page,
  },
  '/appointment/add': {
    title: title(addPageTitle),
    description: 'TODO',
    node: <AddPage />,
    streaming: false,
  },
  '/appointment/add/submit': {
    title: apiEndpointTitle,
    description: 'TODO',
    node: <Submit />,
    streaming: false,
  },
  '/appointment/result': {
    title: apiEndpointTitle,
    description: 'TODO',
    node: <SubmitResult />,
    streaming: false,
  },
}

export default { routes }
