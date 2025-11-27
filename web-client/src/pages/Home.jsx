const Home = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to ZOQIRA</h1>
      <p style={styles.subtitle}>Your Premium Brand Experience</p>
      <div style={styles.content}>
        <p>This is the home page placeholder. UI to be implemented.</p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  title: {
    fontSize: '3rem',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '1.5rem',
    textAlign: 'center',
    color: '#666',
    marginBottom: '2rem'
  },
  content: {
    textAlign: 'center',
    padding: '2rem'
  }
}

export default Home

