release:
		uglifyjs -o delegate-backbone-events.min.js delegate-backbone-events.js

tests:
		open spec/index.html

.PHONY: release tests