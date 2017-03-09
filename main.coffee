style = document.createElement "style"
style.innerHTML = require "./style"
document.head.appendChild style

require("analytics").init('UA-3464282-17')

Template = require "./templates/main"

document.body.appendChild Template
  signupForm: require "./lib/mailchimp"
  templateSample: """
    # templates/panel.jadelet
    .panel
      input(type="text" value=@value)
      select(value=@value options=[@min..@max])
      input(type="range" value=@value min=@min max=@max)
      progress(value=@value max=@max)
  """
  scriptSample: """
    # index.js
    Observable = require("jadelet").Observable;
    PanelTemplate = require("./templates/panel");
    
    model = {
      min: 1,
      max: 10,
      value: Observable(5)
    };
    
    element = PanelTemplate(model);
    document.body.appendChild(element);
  """
