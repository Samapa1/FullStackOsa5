const Notification = ({ message }) => {
  if (message.data === null) {
    return
  }

  if (message.type === 'error') {
    return (
      <div className="messagestyle error">
        {message.data}
      </div>
    )
  }

  return (
    <div className="messagestyle">
      {message.data}
    </div>
  )
}

export default Notification