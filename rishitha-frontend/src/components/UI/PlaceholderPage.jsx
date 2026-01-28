const PlaceholderPage = ({ title, description }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '3rem',
      textAlign: 'center',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
      minHeight: '400px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #e63946 0%, #c1121f 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem',
      }}>
        {title}
      </h2>
      <p style={{
        fontSize: '1.125rem',
        color: '#666',
        maxWidth: '600px',
      }}>
        {description}
      </p>
    </div>
  );
};

export default PlaceholderPage;
