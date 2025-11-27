import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.text}>Page not found</p>
      <Link to="/" style={styles.link}>Go back home</Link>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 80px)',
    padding: '2rem'
  },
  title: {
    fontSize: '6rem',
    marginBottom: '1rem'
  },
  text: {
    fontSize: '1.5rem',
    marginBottom: '2rem'
  },
  link: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px'
  }
}

export default NotFound

