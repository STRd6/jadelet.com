module.exports = ->
  div = document.createElement "div"

  div.innerHTML = """
    <div>
      <form action="//coffee.us8.list-manage.com/subscribe/post?u=77480aba6229057bc27e2261e&amp;id=0458220e6c" method="post" name="mc-embedded-subscribe-form" target="_blank">
    	<h2>Subscribe to our mailing list</h2>
      <div class="mc-field-group">
      	<label for="mce-EMAIL">Email Address <span class="asterisk">*</span>
        </label>
      	<input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL">
      </div>
      <div class="mc-field-group">
      	<label for="mce-FNAME">First Name </label>
      	<input type="text" value="" name="FNAME" class="" id="mce-FNAME">
      </div>
      <div class="mc-field-group">
      	<label for="mce-LNAME">Last Name </label>
      	<input type="text" value="" name="LNAME" class="" id="mce-LNAME">
      </div>
      	<div id="mce-responses" class="clear">
      		<div class="response" id="mce-error-response" style="display:none"></div>
      		<div class="response" id="mce-success-response" style="display:none"></div>
      	</div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
          <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_77480aba6229057bc27e2261e_0458220e6c" tabindex="-1" value=""></div>
          <button value="Subscribe" name="subscribe">Subscribe!</button></div>
      </form>
    </div>
  """

  return div
