release:
		uglifyjs -o delegate-backbone-events.js delegate-backbone-events.min.js

tests:
		open spec/index.html

.PHONY: release tests