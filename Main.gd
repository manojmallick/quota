extends Node2D
## QUOTA — 4-player proximity-voice co-op horror pitch prototype
## Solo MVP: extract haunted assets against a rising "repo agent" quota.

var quota := 3
var extracted := 0
var noise := 0.0
var time_left := 90.0
var alive := true
var label: Label

func _ready() -> void:
	label = Label.new()
	label.position = Vector2(20, 20)
	label.add_theme_font_size_override("font_size", 20)
	add_child(label)
	_refresh()

func _process(delta: float) -> void:
	if not alive:
		return
	time_left -= delta
	noise = maxf(0.0, noise - delta * 0.05)
	if time_left <= 0.0:
		alive = false
		label.text = "TIME UP — quota failed.\nFriendslop pitch: proximity voice + haunted asset repo.\n[R] retry"
		return
	_refresh()

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed:
		if event.keycode == KEY_R:
			quota = 3
			extracted = 0
			noise = 0.0
			time_left = 90.0
			alive = true
			_refresh()
			return
		if not alive:
			return
		match event.keycode:
			KEY_E:
				# extract asset — noisy
				extracted += 1
				noise += 0.25
				if extracted >= quota:
					alive = false
					label.text = "QUOTA MET — extract complete.\nShip with 4-player voice next.\n[R] again"
			KEY_C:
				# crouch / quiet
				noise = maxf(0.0, noise - 0.2)
			KEY_SPACE:
				# sprint — loud
				noise += 0.15
		if noise >= 1.0:
			alive = false
			label.text = "REPO AGENTS FOUND YOU.\n[R] retry"
		_refresh()

func _refresh() -> void:
	if not alive:
		return
	label.text = "QUOTA  ·  extract haunted assets\nExtracted %d/%d  ·  Noise %.0f%%  ·  %.0fs\n[E] extract  [C] quiet  [Space] sprint  [R] restart" % [
		extracted, quota, noise * 100.0, time_left
	]
