style = document.createElement "style"
style.innerHTML = require "./style"
document.head.appendChild style

require("analytics").init('UA-3464282-17')

Template = require "./templates/main"

document.body.appendChild Template
  signupForm: require "./lib/mailchimp"
  templateSample: """
    # templates/section.jadelet
    section
      h1= @title
      p= @text
  """
  scriptSample: """
    # index.js
    PanelTemplate = require("./templates/section");
    
    model = {
      title: "Hello",
      text: "Welcome to Jadelet"
    };

    element = PanelTemplate(model);
    document.body.appendChild(element);
  """
