<%def name="video(track)">
	${video_html5(track)}
	${video_non_html5(track)}
	
	## AllanC - currently the only form of video being generated by the mediaprocess is h264.
	## In the future this could be changed to use the plain css selectors, for now this is sufficent.
	<script type="text/javascript">
		function init_video() {
			if (typeof(Modernizr) == "undefined" || Modernizr.video.h264) {
				$('.html5_video_embed').show(); // Show html5 video element
				$('.html5_video_link' ).hide(); // Hide the static video link
			}
			else {
				cycleThumbnail();
				if (typeof(cycle_interval_id) != "undefined") {clearInterval(cycle_interval_id);}
				cycle_interval_id = setInterval(cycleThumbnail, 3000); // Start the coursel for the staic images
			}
		}
		$(document).ready(function() {init_video();});
	</script>
</%def>

<%def name="video_html5(track)">
	<!-- html5 - video -->
	<div class="html5_video_embed" style="display: none;">
		<video class="video_placeholder" preload="none" poster="${h.thumbnail_location_from_track(track)}" durationHint="${track['duration']}" controls>
			% for preview, url in h.attachment_locations(track, 'preview'):
				<source src="${url}" type="video/${h.video_mime_type(preview)}" />
				##<p>${preview['extra_fields'].get('vcodec','unknown')}</p>
			% endfor
			<%doc>
				% for extension, video_type in h.video_files:
					% if extension in attachment['location']:
					% endif
				% endfor
			</%doc>
		</video>
	</div>
</%def>

<%def name="video_non_html5(track)">
	<!-- non html5 - video link & thumbnail carousel -->
	<div class="html5_video_link">
		<% previews = h.attachment_locations(track, 'preview') %>
		<!-- thumbnails -->
		
		% if previews:
		<a href="${previews[0][1]}" rel=external target="_blank">
		% endif
		
		<div class="thumbnails">
		% for image_url in h.attachment_locations_by_type(track,'image'):
			<img src="${image_url}" class="video_placeholder" style="display: none;" />
		% endfor
		</div>
		
		% if previews:
		</a>
		% endif
		
		## Cycle the images as a carousel (custom carousel via plain hide/show)
		<script type="text/javascript">
			var current_thumbnail = current_thumbnail || null;
			function cycleThumbnail() {
				if (current_thumbnail) {
					current_thumbnail.hide();
					current_thumbnail = current_thumbnail.next();
				}
				if (current_thumbnail==null || current_thumbnail.length==0) {
					current_thumbnail = $('.thumbnails').children('img:first');
				}
				if (current_thumbnail) {
					current_thumbnail.show();
				}
			}
		</script>
		
		% for preview, url in previews[1:]:
		<a href="${url}" data-role="button" rel=external target="_blank">Preview Video</a>
		## ${preview['extra_fields'].get('target','unknown')}
		% endfor
	</div>
</%def>