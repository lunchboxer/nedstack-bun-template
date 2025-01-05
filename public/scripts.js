document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme')
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
  const theme = savedTheme || systemTheme
  document.querySelector(`.theme-switcher input[value="${theme}"]`).checked =
    true
  localStorage.setItem('theme', theme)

  document
    .getElementById('theme-switcher-light')
    .addEventListener('click', () => {
      localStorage.setItem('theme', 'light')
    })
  document
    .getElementById('theme-switcher-dark')
    .addEventListener('click', () => {
      localStorage.setItem('theme', 'dark')
    })

  const deleteButton = document.getElementById('delete-user-button')
  if (deleteButton) {
    deleteButton.addEventListener('click', () => {
      const deleteModal = document.getElementById('deleteModal')
      if (deleteModal) {
        deleteModal.showModal()
      }
    })
  }
})
