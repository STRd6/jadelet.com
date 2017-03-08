style = document.createElement "style"
style.innerHTML = require "./style"
document.head.appendChild style

require("analytics").init('UA-3464282-17')

Template = require "./templates/main"

document.body.appendChild Template
  signupForm: require "./lib/mailchimp"
