import { o } from '../jsx/jsx.js'
import { Routes } from '../routes.js'
import { apiEndpointTitle, title } from '../../config.js'
import Style from '../components/style.js'
import { Context, DynamicContext, getContextFormBody } from '../context.js'
import { mapArray } from '../components/fragment.js'
import { dateString, email, id, object, string, timeString } from 'cast.ts'
import { Link, Redirect } from '../components/router.js'
import { renderError } from '../components/error.js'
import { getAuthUser } from '../auth/user.js'
import { proxy } from '../../../db/proxy.js'

let pageTitle = 'Timeslot'
let addPageTitle = 'Add Timeslot'

let style = Style(/* css */ `
#Timeslot {

}
.timeslot {
  margin-top: 1rem
}
.field {
  margin-top: 0.5rem;
}
.field input,
.field textarea {
  display: block;
}
button {
  text-transform: capitalize
}
`)

let page = (
  <>
    {style}
    <div id="Timeslot">
      <h1>{pageTitle}</h1>
      <Main />
    </div>
  </>
)

function Main(attrs: {}, context: DynamicContext) {
  let user = getAuthUser(context)
  let id = new URLSearchParams(context.routerMatch?.search).get('id')
  return (
    <>
      <ol>
        {mapArray(proxy.timeslot, timeslot => (
          <li class="timeslot">
            <div>
              {timeslot.date} {timeslot.from_time}-{timeslot.to_time}
            </div>
            <div>{timeslot.title}</div>
            <Link href={`/timeslot?id=${timeslot.id}`}>
              <button>make appointment</button>
            </Link>
            {id == timeslot.id ? (
              <form method="POST" action="/timeslot/appointment/submit">
                <input name="timeslot_id" value={timeslot.id} hidden />
                <div class="field">
                  <label>
                    email*:
                    <input name="email" type="email" required />
                  </label>
                </div>
                <div class="field">
                  <label>
                    name*:
                    <input name="name" required minlength="3" maxlength="50" />
                  </label>
                </div>
                <div class="field">
                  <label>
                    remark:
                    <textarea name="remark" />
                  </label>
                </div>
                <div className="field">
                  <input type="submit" value="Submit Appointment" />
                </div>
              </form>
            ) : null}
          </li>
        ))}
      </ol>
      {user && user.id == 1 ? (
        <Link href="/timeslot/add">
          <button>{addPageTitle}</button>
        </Link>
      ) : null}
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
          <input name="date" type="date" required min="2024-02-24" />
        </label>
      </div>
      <div class="field">
        <label>
          From Time*:
          <input name="from_time" type="time" required />
        </label>
        <label>
          To Time*:
          <input name="to_time" type="time" required />
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
  from_time: timeString(),
  to_time: timeString(),
})

function Submit(attrs: {}, context: DynamicContext) {
  try {
    let user = getAuthUser(context)
    if (!user) throw 'You must be logged in to submit ' + pageTitle
    let body = getContextFormBody(context)
    let input = submitParser.parse(body)
    let id = proxy.timeslot.push({
      title: input.title,
      date: input.date,
      from_time: input.from_time,
      to_time: input.to_time,
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

let submitAppointmentParser = object({
  timeslot_id: id(),
  email: email(),
  name: string({ nonEmpty: true }),
  remark: string({ nonEmpty: false }),
})

function SubmitAppointment(attrs: {}, context: DynamicContext) {
  try {
    let user = getAuthUser(context)
    if (!user) throw 'You must be logged in to submit ' + pageTitle
    let body = getContextFormBody(context)
    let input = submitAppointmentParser.parse(body)
    let id = proxy.appointment.push({
      timeslot_id: input.timeslot_id,
      email: input.email,
      name: input.name,
      remark: input.remark,
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
  '/timeslot/appointment/submit': {
    title: apiEndpointTitle,
    description: 'TODO',
    node: <SubmitAppointment />,
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
