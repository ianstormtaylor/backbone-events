release:
	uglifyjs -o backbone-events.min.js backbone-events.js

test:
	open test/index.html

docs:
	docco backbone-events.js
	open docs/backbone-events.html

.PHONY: release test docs
