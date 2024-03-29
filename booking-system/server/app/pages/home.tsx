import { o } from '../jsx/jsx.js'
import { prerender } from '../jsx/html.js'
import SourceCode from '../components/source-code.js'
import { Link } from '../components/router.js'

// Calling <Component/> will transform the JSX into AST for each rendering.
// You can reuse a pre-compute AST like `let component = <Component/>`.

// If the expression is static (not depending on the render Context),
// you don't have to wrap it by a function at all.

let content = (
  <div id="home">
    <h1>Home Page</h1>
    <p>A booking system</p>
    <p>
      See available <Link href="/timeslot">timeslot</Link>
    </p>
    <SourceCode page="home.tsx" />
  </div>
)

// And it can be pre-rendered into html as well
let Home = prerender(content)

export default Home
