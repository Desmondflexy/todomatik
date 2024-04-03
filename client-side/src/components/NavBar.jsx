import PropTypes from "prop-types"

/**The Nav bar component */
export default function NavBar(props) {
  return (
    <nav>
      <h1>TodoMatic</h1>
      {props.children}
    </nav>
  )
}

NavBar.propTypes = {
  children: PropTypes.node.isRequired
}