var keycode_map = {
	"KC_NO": {
		"name": "None",
		"description": "Reserved (no event indicated)",
		"keycode": "0x00",
		"label": [ "no" ]
	},
	/*
	"KC_ROLL_OVER": {
		"name": "ErrorRollOver",
		"description": "ErrorRollOver",
		"keycode": "0x01"
	},
	*/
	"KC_TRANSPARENT": {
		"name": "Transparent",
		"description": "Transparent",
		"keycode": "0x01",
		"label": [ "" ],
		"label_priority": [ "" ],
		"short_name": "KC_TRNS"
	},
	"KC_POST_FAIL":	{
		"name": "POSTFail",
		"description": "POSTFail",
		"keycode": "0x02"
	},
	"KC_UNDEFINED": {
		"name": "ErrorUndefined",
		"description": "ErrorUndefined",
		"keycode": "0x03"
	},
	"KC_A": {
		"name": "a and A",
		"description": "a and A",
		"keycode": "0x04",
		"label": [ "a" ]
	},
	"KC_B": {
		"name": "b and B",
		"description": "b and B",
		"keycode": "0x05",
		"label": [ "b" ]
	},
	"KC_C": {
		"name": "c and C",
		"description": "c and C",
		"keycode": "0x06",
		"label": [ "c" ]
	},
	"KC_D": {
		"name": "d and D",
		"description": "d and D",
		"keycode": "0x07",
		"label": [ "d" ]
	},
	"KC_E": {
		"name": "e and E",
		"description": "e and E",
		"keycode": "0x08",
		"label": [ "e" ]
	},
	"KC_F": {
		"name": "f and F",
		"description": "f and F",
		"keycode": "0x09",
		"label": [ "f" ]
	},
	"KC_G": {
		"name": "g and G",
		"description": "g and G",
		"keycode": "0x0A",
		"label": [ "g" ]
	},
	"KC_H": {
		"name": "h and H",
		"description": "h and H",
		"keycode": "0x0B",
		"label": [ "h" ]
	},
	"KC_I": {
		"name": "i and I",
		"description": "i and I",
		"keycode": "0x0C",
		"label": [ "i" ]
	},
	"KC_J": {
		"name": "j and J",
		"description": "j and J",
		"keycode": "0x0D",
		"label": [ "j" ]
	},
	"KC_K": {
		"name": "k and K",
		"description": "k and K",
		"keycode": "0x0E",
		"label": [ "k" ]
	},
	"KC_L": {
		"name": "l and L",
		"description": "l and L",
		"keycode": "0x0F",
		"label": [ "l" ]
	},
	"KC_M": {
		"name": "m and M",
		"description": "m and M",
		"keycode": "0x10",
		"label": [ "m" ]
	},
	"KC_N": {
		"name": "n and N",
		"description": "n and N",
		"keycode": "0x11",
		"label": [ "n" ]
	},
	"KC_O": {
		"name": "o and O",
		"description": "o and O",
		"keycode": "0x12",
		"label": [ "o" ]
	},
	"KC_P": {
		"name": "p and P",
		"description": "p and P",
		"keycode": "0x13",
		"label": [ "p" ]
	},
	"KC_Q": {
		"name": "q and Q",
		"description": "q and Q",
		"keycode": "0x14",
		"label": [ "q" ]
	},
	"KC_R": {
		"name": "r and R",
		"description": "r and R",
		"keycode": "0x15",
		"label": [ "r" ]
	},
	"KC_S": {
		"name": "s and S",
		"description": "s and S",
		"keycode": "0x16",
		"label": [ "s" ]
	},
	"KC_T": {
		"name": "t and T",
		"description": "t and T",
		"keycode": "0x17",
		"label": [ "t" ]
	},
	"KC_U": {
		"name": "u and U",
		"description": "u and U",
		"keycode": "0x18",
		"label": [ "u" ]
	},
	"KC_V": {
		"name": "v and V",
		"description": "v and V",
		"keycode": "0x19",
		"label": [ "v" ]
	},
	"KC_W": {
		"name": "w and W",
		"description": "w and W",
		"keycode": "0x1A",
		"label": [ "w" ]
	},
	"KC_X": {
		"name": "x and X",
		"description": "x and X",
		"keycode": "0x1B",
		"label": [ "x" ]
	},
	"KC_Y": {
		"name": "y and Y",
		"description": "y and Y",
		"keycode": "0x1C",
		"label": [ "y" ]
	},
	"KC_Z": {
		"name": "z and Z",
		"description": "z and Z",
		"keycode": "0x1D",
		"label": [ "z" ]
	},
	"KC_1": {
		"name": "1 and !",
		"description": "1 and !",
		"keycode": "0x1E",
		"label": [ "!" ],
		"label_2": [ "1" ]
	},
	"KC_2": {
		"name": "2 and @",
		"description": "2 and @",
		"keycode": "0x1F",
		"label": [ "@", "\"" ],
		"label_2": [ "2" ]
	},
	"KC_3": {
		"name": "3 and #",
		"description": "3 and #",
		"keycode": "0x20",
		"label": [ "#", "£" ],
		"label_2": [ "3" ]
	},
	"KC_4": {
		"name": "4 and $",
		"description": "4 and $",
		"keycode": "0x21",
		"label": [ "$" ],
		"label_2": [ "4" ]
	},
	"KC_5": {
		"name": "5 and %",
		"description": "5 and %",
		"keycode": "0x22",
		"label": [ "%" ],
		"label_2": [ "5" ]
	},
	"KC_6": {
		"name": "6 and ^",
		"description": "6 and ^",
		"keycode": "0x23",
		"label": [ "^", "&" ],
		"label_2": [ "6" ]
	},
	"KC_7": {
		"name": "7 and &",
		"description": "7 and &",
		"keycode": "0x24",
		"label": [ "&", "'" ],
		"label_2": [ "7" ]
	},
	"KC_8": {
		"name": "8 and *",
		"description": "8 and *",
		"keycode": "0x25",
		"label": [ "*", "(" ],
		"label_2": [ "8" ]
	},
	"KC_9": {
		"name": "9 and (",
		"description": "9 and (",
		"keycode": "0x26",
		"label": [ "(", ")" ],
		"label_2": [ "9" ]
	},
	"KC_0": {
		"name": "0 and )",
		"description": "0 and )",
		"keycode": "0x27",
		"label": [ ")", "" ],
		"label_2": [ "0" ]
	},
	"KC_ENTER": {
		"name": "Enter",
		"description": "Enter (Return)",
		"keycode": "0x28",
		"label": [ "enter", "return" ],
		"label_priority": [ "enter", "return" ],
		"short_name": "KC_ENT"
	},
	"KC_ESCAPE": {
		"name": "Esc",
		"description": "Esc (Escape)",
		"keycode": "0x29",
		"label": [ "escape", "esc" ],
		"short_name": "KC_ESC"
	},
	"KC_BSPACE": {
		"name": "Backspace",
		"description": "Backspace (Delete)",
		"keycode": "0x2A",
		"label": [ "delete", "backspace", "back space", "bs" ],
		"short_name": "KC_BSPC"
	},
	"KC_TAB": {
		"name": "Tab",
		"description": "Tab",
		"keycode": "0x2B",
		"label": [ "tab" ]
	},
	"KC_SPACE": {
		"name": "Spacebar",
		"description": "Spacebar",
		"keycode": "0x2C",
		"label": [ "spacebar", "space", "spc", "" ],
		"short_name": "KC_SPC"
	},
	"KC_MINUS": {
		"name": "- and _",
		"description": "- and _",
		"keycode": "0x2D",
		"label": [ "_", "&mdash;", "=" ],
		"label_2": [ "-", "&ndash;" ],
		"short_name": "KC_MINS"
	},
	"KC_EQUAL": {
		"name": "= and +",
		"description": "= and +",
		"keycode": "0x2E",
		"label": [ [ "+" ], [ "~" ] ],
		"label_2": [ [ "=" ], [ "^" ] ],
		"short_name": "KC_EQL"
	},
	"KC_LBRACKET": {
		"name": "[ and {",
		"description": "[ and {",
		"keycode": "0x2F",
		"label": [ [ "{" ], [ "、" ] ],
		"label_2": [ [ "[" ], [ "@" ] ],
		"label_priority": [ "{" ],
		"short_name": "KC_LBRC"
	},
	"KC_RBRACKET": {
		"name": "] and }",
		"description": "] and }",
		"keycode": "0x30",
		"label": [ [ "}" ], [ "{" ], [ "jpn [", "jpn {" ] ],
		"label_2": [ [ "]" ], [ "["], [] ],
		"label_priority": [ "}" ],
		"short_name": "KC_RBRC"
	},
	"KC_BSLASH": {
		"name": "\\ and |",
		"description": "\\ and |",
		"keycode": "0x31",
		"label": [ [ "|" ], [ "}" ], [ "jpn ]", "jpn }" ] ],
		"label_2": [ [ "\\" ], [ "]" ], [] ],
		"label_priority": [ "|" ],
		"short_name": "KC_BSLS"
	},
	"KC_NONUS_HASH": {
		"name": "Non-US # and ~",
		"description": "Non-US # and ~",
		"keycode": "0x32",
		"label": [ "~" ],
		"label_2": [ "#" ],
		"short_name": "KC_NUHS"
	},
	"KC_SCOLON": {
		"name": "; and :",
		"description": "; and :",
		"keycode": "0x33",
		"label": [ [ ":" ], [ "+" ] ],
		"label_2": [ [ ";" ], [ ";" ] ],
		"short_name": "KC_SCLN"
	},
	"KC_QUOTE": {
		"name": "' and \"",
		"description": "' and \"",
		"keycode": "0x34",
		"label": [ [ "\"", "@" ], [ "*" ] ],
		"label_2": [ [ "'" ], [ ":" ] ],
		"short_name": "KC_QUOT"
	},
	"KC_GRAVE": {
		"name": "` and ~",
		"description": "`(grave accent) and ~(tilde)",
		"keycode": "0x35",
		"label": [ [ "~", "¬" ], [ "半角/全角" ], [ "e/j" ] ],
		"label_2": [ [ "`" ], [ "漢字" ], [] ],
		"short_name": "KC_GRV"
	},
	"KC_COMMA": {
		"name": ", and <",
		"description": ", and <",
		"keycode": "0x36",
		"label": [ "<" ],
		"label_2": [ "," ],
		"short_name": "KC_COMM"
	},
	"KC_DOT": {
		"name": ". and >",
		"description": ". and >",
		"keycode": "0x37",
		"label": [ ">" ],
		"label_2": [ "." ]
	},
	"KC_SLASH": {
		"name": "/ and ?",
		"description": "/ and ?",
		"keycode": "0x38",
		"label": [ "?" ],
		"label_2": [ "/" ],
		"short_name": "KC_SLSH"
	},
	"KC_CAPSLOCK": {
		"name": "Caps Lock",
		"description": "Caps Lock",
		"keycode": "0x39",
		"label": [ "capslock", "caps lock", "caps" ],
		"short_name": "KC_CAPS"
	},
	"KC_F1": {
		"name": "F1",
		"description": "F1",
		"keycode": "0x3A",
		"label": [ "f1" ]
	},
	"KC_F2": {
		"name": "F2",
		"description": "F2",
		"keycode": "0x3B",
		"label": [ "f2" ]
	},
	"KC_F3": {
		"name": "F3",
		"description": "F3",
		"keycode": "0x3C",
		"label": [ "f3" ]
	},
	"KC_F4": {
		"name": "F4",
		"description": "F4",
		"keycode": "0x3D",
		"label": [ "f4" ]
	},
	"KC_F5": {
		"name": "F5",
		"description": "F5",
		"keycode": "0x3E",
		"label": [ "f5" ]
	},
	"KC_F6": {
		"name": "F6",
		"description": "F6",
		"keycode": "0x3F",
		"label": [ "f6" ]
	},
	"KC_F7": {
		"name": "F7",
		"description": "F7",
		"keycode": "0x40",
		"label": [ "f7" ]
	},
	"KC_F8": {
		"name": "F8",
		"description": "F8",
		"keycode": "0x41",
		"label": [ "f8" ]
	},
	"KC_F9": {
		"name": "F9",
		"description": "F9",
		"keycode": "0x42",
		"label": [ "f9" ]
	},
	"KC_F10": {
		"name": "F10",
		"description": "F10",
		"keycode": "0x43",
		"label": [ "f10" ]
	},
	"KC_F11": {
		"name": "F11",
		"description": "F11",
		"keycode": "0x44",
		"label": [ "f11" ]
	},
	"KC_F12": {
		"name": "F12",
		"description": "F12",
		"keycode": "0x45",
		"label": [ "f12" ]
	},
	"KC_PSCREEN": {
		"name": "Print Screen",
		"description": "Print Screen",
		"keycode": "0x46",
		"label": [ "printscreen", "print screen", "prtsc", "print", "psc" ],
		"short_name": "KC_PSCR"
	},
	"KC_SCROLLLOCK": {
		"name": "Scroll Lock",
		"description": "Scroll Lock",
		"keycode": "0x47",
		"label": [ "scroll lock", "scrolllock", "scrlc", "scrlk" ],
		"short_name": "KC_SLCK"
	},
	"KC_PAUSE": {
		"name": "Pause and Break",
		"description": "Pause and Break",
		"keycode": "0x48",
		"label": [ "pause", "pus" ],
		"label_2": [ "break", "brk" ],
		"short_name": "KC_PAUS"
	},
	"KC_INSERT": {
		"name": "Insert",
		"description": "Insert",
		"keycode": "0x49",
		"label": [ "insert", "ins" ],
		"short_name": "KC_INS"
	},
	"KC_HOME": {
		"name": "Home",
		"description": "Home",
		"keycode": "0x4A",
		"label": [ "home" ]
	},
	"KC_PGUP": {
		"name": "PageUp",
		"description": "PageUp",
		"keycode": "0x4B",
		"label": [ "pageup", "page up", "pgup" ]
	},
	"KC_DELETE": {
		"name": "Delete",
		"description": "Delete (Delete Forward)",
		"keycode": "0x4C",
		"label": [ "delete", "del" ],
		"label_priority": [ "delete" ],
		"short_name": "KC_DEL"
	},
	"KC_END": {
		"name": "End",
		"description": "End",
		"keycode": "0x4D",
		"label": [ "end" ]
	},
	"KC_PGDOWN": {
		"name": "PageDown",
		"description": "PageDown",
		"keycode": "0x4E",
		"label": [ "pagedown", "page down", "pgdn" ],
		"short_name": "KC_PGDN"
	},
	"KC_RIGHT": {
		"name": "→ (Right)",
		"description": "RightArrow",
		"keycode": "0x4F",
		"label": [ "right", "→", "&#9656;" ],
		"short_name": "KC_RGHT"
	},
	"KC_LEFT": {
		"name": "← (Left)",
		"description": "LeftArrow",
		"keycode": "0x50",
		"label": [ "left", "←", "&#9666;" ]
	},
	"KC_DOWN": {
		"name": "↓ (Down)",
		"description": "DownArrow",
		"keycode": "0x51",
		"label": [ "down", "↓", "&#9662;" ]
	},
	"KC_UP": {
		"name": "↑ (Up)",
		"description": "UpArrow",
		"keycode": "0x52",
		"label": [ "up", "↑", "&#9652;" ]
	},
	"KC_NUMLOCK": {
		"name": "Num Lock and Clear",
		"description": "Num Lock and Clear",
		"keycode": "0x53",
		"label": [ "num lock", "numlock", "nmlck" ],
		"short_name": "KC_NLCK"
	},
	"KC_KP_SLASH": {
		"name": "Keypad /",
		"description": "Keypad /",
		"keycode": "0x54",
		"label": [ [ "/" ], [ "p/" ] ],
		"label_2": [ [ "" ], [] ],
		"short_name": "KC_PSLS"
	},
	"KC_KP_ASTERISK": {
		"name": "Keypad *",
		"description": "Keypad *",
		"keycode": "0x55",
		"label": [ [ "*" ], [ "p*" ] ],
		"label_2": [ [ "" ], [] ],
		"short_name": "KC_PAST"
	},
	"KC_KP_MINUS": {
		"name": "Keypad -",
		"description": "Keypad -",
		"keycode": "0x56",
		"label": [ [ "-", "&ndash;" ], [ "p-" ] ],
		"label_2": [ [ "" ], [] ],
		"short_name": "KC_PMNS"
	},
	"KC_KP_PLUS": {
		"name": "Keypad +",
		"description": "Keypad +",
		"keycode": "0x57",
		"label": [ [ "+" ], [ "p+" ] ],
		"label_2": [ [ "" ], [] ],
		"short_name": "KC_PPLS"
	},
	"KC_KP_ENTER": {
		"name": "Keypad Enter",
		"description": "Keypad Enter",
		"keycode": "0x58",
		"label": [ "enter", "penter" ],
		"short_name": "KC_PENT"
	},
	"KC_KP_1": {
		"name": "Keypad 1 and End",
		"description": "Keypad 1 and End",
		"keycode": "0x59",
		"label": [ [ "1" ], [ "p1" ] ],
		"label_2": [ [ "end" ], [] ],
		"short_name": "KC_P1"
	},
	"KC_KP_2": {
		"name": "Keypad 2 and Down",
		"description": "Keypad 2 and DownArrow",
		"keycode": "0x5A",
		"label": [ [ "2" ], [ "p2" ] ],
		"label_2": [ [ "down", "↓" ], [] ],
		"short_name": "KC_P2"
	},
	"KC_KP_3": {
		"name": "Keypad 3 and PageDown",
		"description": "Keypad 3 and PageDown",
		"keycode": "0x5B",
		"label": [ [ "3" ], [ "p3" ] ],
		"label_2": [ [ "pagedown", "page down", "pgdn" ], [] ],
		"short_name": "KC_P3"
	},
	"KC_KP_4": {
		"name": "Keypad 4 and Left",
		"description": "Keypad 4 and LeftArrow",
		"keycode": "0x5C",
		"label": [ [ "4" ], [ "p4" ] ],
		"label_2": [ [ "left", "←" ], [] ],
		"short_name": "KC_P4"
	},
	"KC_KP_5": {
		"name": "Keypad 5",
		"description": "Keypad 5",
		"keycode": "0x5D",
		"label": [ [ "5" ], [ "p5" ] ],
		"label_2": [ [ "" ], [] ],
		"short_name": "KC_P5"
	},
	"KC_KP_6": {
		"name": "Keypad 6 and Right",
		"description": "Keypad 6 and RightArrow",
		"keycode": "0x5E",
		"label": [ [ "6" ], [ "p6" ] ],
		"label_2": [ [ "right", "→" ], [] ],
		"short_name": "KC_P6"
	},
	"KC_KP_7": {
		"name": "Keypad 7 and Home",
		"description": "Keypad 7 and Home",
		"keycode": "0x5F",
		"label": [ [ "7" ], [ "p7" ] ],
		"label_2": [ [ "home" ], [] ],
		"short_name": "KC_P7"
	},
	"KC_KP_8": {
		"name": "Keypad 8 and Up",
		"description": "Keypad 8 and UpArrow",
		"keycode": "0x60",
		"label": [ [ "8" ], [ "p8" ] ],
		"label_2": [ [ "up", "↑" ], [] ],
		"short_name": "KC_P8"
	},
	"KC_KP_9": {
		"name": "Keypad 9 and PageUp",
		"description": "Keypad 9 and PageUp",
		"keycode": "0x61",
		"label": [ [ "9" ], [ "p9" ] ],
		"label_2": [ [ "pageup", "page up", "pgup" ], [] ],
		"short_name": "KC_P9"
	},
	"KC_KP_0": {
		"name": "Keypad 0 and Insert",
		"description": "Keypad 0 and Insert",
		"keycode": "0x62",
		"label": [ [ "0" ], [ "p0" ] ],
		"label_2": [ [ "insert", "ins" ], [] ],
		"short_name": "KC_P0"
	},
	"KC_KP_DOT": {
		"name": "Keypad . and Delete",
		"description": "Keypad . and Delete",
		"keycode": "0x63",
		"label": [ [ "." ], [ "p." ] ],
		"label_2": [ [ "delete", "del" ], [] ],
		"short_name": "KC_PDOT"
	},
	"KC_NONUS_BSLASH": {
		"name": "Non-US \\ and |",
		"description": "Non-US \\ and |",
		"keycode": "0x64",
		"label": [ "|", "iso |" ],
		"label_2": [ "\\" ],
		"short_name": "KC_NUBS"
	},
	"KC_APPLICATION": {
		"name": "Application",
		"description": "Application (Menu)",
		"keycode": "0x65",
		"label": [ "app", "menu" ],
		"label_priority": [ "menu" ],
		"short_name": "KC_APP"
	},
	"KC_POWER": {
		"name": "Power",
		"description": "Power",
		"keycode": "0x66"
	},
	"KC_KP_EQUAL": {
		"name": "Keypad =",
		"description": "Keypad =",
		"keycode": "0x67",
		"label": [ [ "=" ], [ "p=" ] ],
		"label_2": [ [ "" ], [] ],
		"short_name": "KC_PEQL"
	},
	"KC_F13": {
		"name": "F13",
		"description": "F13",
		"keycode": "0x68",
		"label": [ "f13" ]
	},
	"KC_F14": {
		"name": "F14",
		"description": "F14",
		"keycode": "0x69",
		"label": [ "f14" ]
	},
	"KC_F15": {
		"name": "F15",
		"description": "F15",
		"keycode": "0x6A",
		"label": [ "f15" ]
	},
	"KC_F16": {
		"name": "F16",
		"description": "F16",
		"keycode": "0x6B",
		"label": [ "f16" ]
	},
	"KC_F17": {
		"name": "F17",
		"description": "F17",
		"keycode": "0x6C",
		"label": [ "f17" ]
	},
	"KC_F18": {
		"name": "F18",
		"description": "F18",
		"keycode": "0x6D",
		"label": [ "f18" ]
	},
	"KC_F19": {
		"name": "F19",
		"description": "F19",
		"keycode": "0x6E",
		"label": [ "f19" ]
	},
	"KC_F20": {
		"name": "F20",
		"description": "F20",
		"keycode": "0x6F",
		"label": [ "f20" ]
	},
	"KC_F21": {
		"name": "F21",
		"description": "F21",
		"keycode": "0x70",
		"label": [ "f21" ]
	},
	"KC_F22": {
		"name": "F22",
		"description": "F22",
		"keycode": "0x71",
		"label": [ "f22" ]
	},
	"KC_F23": {
		"name": "F23",
		"description": "F23",
		"keycode": "0x72",
		"label": [ "f23" ]
	},
	"KC_F24": {
		"name": "F24",
		"description": "F24",
		"keycode": "0x73",
		"label": [ "f24" ]
	},
	"KC_EXECUTE": {
		"name": "Excute",
		"description": "Excute",
		"keycode": "0x74",
		"label": [ "excute" ]
	},
	"KC_HELP": {
		"name": "Help",
		"description": "Help",
		"keycode": "0x75",
		"label": [ "help" ]
	},
	"KC_MENU": {
		"name": "Menu",
		"description": "Menu",
		"keycode": "0x76",
		"label": [ "menu" ]
	},
	"KC_SELECT": {
		"name": "Select",
		"description": "Select",
		"keycode": "0x77",
		"label": [ "select" ]
	},
	"KC_STOP": {
		"name": "Stop",
		"description": "Stop",
		"keycode": "0x78",
		"label": [ "stop" ]
	},
	"KC_AGAIN": {
		"name": "Again",
		"description": "Again",
		"keycode": "0x79",
		"label": [ "again" ]
	},
	"KC_UNDO": {
		"name": "Undo",
		"description": "Undo",
		"keycode": "0x7A",
		"label": [ "undo" ]
	},
	"KC_CUT": {
		"name": "Cut",
		"description": "Cut",
		"keycode": "0x7B",
		"label": [ "cut" ]
	},
	"KC_COPY": {
		"name": "Copy",
		"description": "Copy",
		"keycode": "0x7C",
		"label": [ "copy" ]
	},
	"KC_PASTE": {
		"name": "Paste",
		"description": "Paste",
		"keycode": "0x7D",
		"label": [ "paste" ]
	},
	"KC_FIND": {
		"name": "Find",
		"description": "Find",
		"keycode": "0x7E",
		"label": [ "find" ]
	},
	"KC__MUTE": {
		"name": "Mute",
		"description": "Mute",
		"keycode": "0x7F"
	},
	"KC__VOLUP": {
		"name": "Volume Up",
		"description": "Volume Up",
		"keycode": "0x80"
	},
	"KC__VOLDOWN": {
		"name": "Volumn Down",
		"description": "Volumn Down",
		"keycode": "0x81"
	},
	"KC_LOCKING_CAPS": {
		"name": "Locking Caps Lock",
		"description": "Locking Caps Lock",
		"keycode": "0x82",
		"label": [ "locking caps lock" ],
	},
	"KC_LOCKING_NUM": {
		"name": "Locking Nums Lock",
		"description": "Locking Nums Lock",
		"keycode": "0x83",
		"label": [ "locking nums lock" ],
	},
	"KC_LOCKING_SCROLL": {
		"name": "Locking Scroll Lock",
		"description": "Locking Scroll Lock",
		"keycode": "0x84",
		"label": [ "locking scroll lock" ],
	},
	"KC_KP_COMMA": {
		"name": "Keypad ,",
		"description": "Keypad ,(Comma)",
		"keycode": "0x85",
		"label": [ [ "," ], [ "p," ] ],
		"label_2": [ [ "" ], [] ],
		"short_name": "KC_PCMM"
	},
	"KC_KP_EQUAL_AS400": {
		"name": "Keypad Equal Sign on AS/400",
		"description": "Keypad Equal Sign on AS/400",
		"keycode": "0x86",
	},
	"KC_INT1": {
		"name": "International1",
		"description": "International1",
		"keycode": "0x87",
		"label": [ [ "int1", "ro" ], [ "_" ] ],
		"label_2": [ [], [ "\\" ] ],
		"short_name": "KC_RO"
	},
	"KC_INT2": {
		"name": "International2",
		"description": "International2",
		"keycode": "0x88",
		"label": [ "int2", "kana" ],
		"short_name": "KC_KANA"
	},
	"KC_INT3": {
		"name": "International3",
		"description": "International3",
		"keycode": "0x89",
		"label": [ [ "int3", "yen", "¥" ], [ "|" ] ],
		"label_2": [ [], [ "¥" ] ],
		"short_name": "KC_JYEN"
	},
	"KC_INT4": {
		"name": "International4",
		"description": "International4",
		"keycode": "0x8A",
		"label": [ "int4", "henkan" ],
		"short_name": "KC_HENK"
	},
	"KC_INT5": {
		"name": "International5",
		"description": "International5",
		"keycode": "0x8B",
		"label": [ "int5", "muhenkan" ],
		"short_name": "KC_MHEN"
	},
	"KC_INT6": {
		"name": "International6",
		"description": "International6",
		"keycode": "0x8C",
		"label": [ "int6" ]
	},
	"KC_INT7": {
		"name": "International7",
		"description": "International7",
		"keycode": "0x8D",
		"label": [ "int7" ]
	},
	"KC_INT8": {
		"name": "International8",
		"description": "International8",
		"keycode": "0x8E",
		"label": [ "int8" ]
	},
	"KC_INT9": {
		"name": "International9",
		"description": "International9",
		"keycode": "0x8F",
		"label": [ "int9" ]
	},
	"KC_LANG1": {
		"name": "LANG1",
		"description": "LANG1",
		"keycode": "0x90",
		"label": [ "lang1" ]
	},
	"KC_LANG2": {
		"name": "LANG2",
		"description": "LANG2",
		"keycode": "0x91",
		"label": [ "lang2" ]
	},
	"KC_LANG3": {
		"name": "LANG3",
		"description": "LANG3",
		"keycode": "0x92",
		"label": [ "lang3" ]
	},
	"KC_LANG4": {
		"name": "LANG4",
		"description": "LANG4",
		"keycode": "0x93",
		"label": [ "lang4" ]
	},
	"KC_LANG5": {
		"name": "LANG5",
		"description": "LANG5",
		"keycode": "0x94",
		"label": [ "lang5" ]
	},
	"KC_LANG6": {
		"name": "LANG6",
		"description": "LANG6",
		"keycode": "0x95",
		"label": [ "lang6" ]
	},
	"KC_LANG7": {
		"name": "LANG7",
		"description": "LANG7",
		"keycode": "0x96",
		"label": [ "lang7" ]
	},
	"KC_LANG8": {
		"name": "LANG8",
		"description": "LANG8",
		"keycode": "0x97",
		"label": [ "lang8" ]
	},
	"KC_LANG9": {
		"name": "LANG9",
		"description": "LANG9",
		"keycode": "0x98",
		"label": [ "lang9" ]
	},
	"KC_ALT_ERASE": {
		"name": "Alternate Erase",
		"description": "Alternate Erase",
		"keycode": "0x99"
	},
	"KC_SYSREQ": {
		"name": "SysReq/Attention",
		"description": "SysReq/Attention",
		"keycode": "0x9A",
	},
	"KC_CANCEL": {
		"name": "Cancel",
		"description": "Cancel",
		"keycode": "0x9B"
	},
	"KC_CLEAR": {
		"name": "Clear",
		"description": "Clear",
		"keycode": "0x9C"
	},
	"KC_PRIOR": {
		"name": "Prior",
		"description": "Prior",
		"keycode": "0x9D"
	},
	"KC_RETURN": {
		"name": "Return",
		"description": "Return",
		"keycode": "0x9E"
	},
	"KC_SEPARATOR": {
		"name": "Separator",
		"description": "Separator",
		"keycode": "0x9F"
	},
	"KC_OUT": {
		"name": "Out",
		"description": "Out",
		"keycode": "0xA0"
	},
	"KC_OPER": {
		"name": "Oper",
		"description": "Oper",
		"keycode": "0xA1"
	},
	"KC_CLEAR_AGAIN": {
		"name": "Clear/Again",
		"description": "Clear/Again",
		"keycode": "0xA2"
	},
	"KC_CRSEL": {
		"name": "CrSel/Props",
		"description": "CrSel/Props",
		"keycode": "0xA3"
	},
	"KC_EXSEL": {
		"name": "ExSel",
		"description": "ExSel",
		"keycode": "0xA4"
	},
	/* System Control */
	"KC_SYSTEM_POWER": {
		"name": "System Power Down",
		"description": "System Power Down",
		"keycode": "0xA5",
		"label": [ "power", "pow", "pwr" ],
		"short_name": "KC_PWR"
	},
	"KC_SYSTEM_SLEEP": {
		"name": "System Sleep",
		"description": "System Sleep",
		"keycode": "0xA6",
		"label": [ "sleep", "slp" ],
		"short_name": "KC_SLEP"
	},
	"KC_SYSTEM_WAKE": {
		"name": "System Wake",
		"description": "System Wake",
		"keycode": "0xA7",
		"label": [ "wake" ],
		"short_name": "KC_WAKE"
	},
	/* Media Control */
	"KC_AUDIO_MUTE": {
		"name": "Audio Mute",
		"description": "Audio Mute",
		"keycode": "0xA8",
		"label": [ "mute" ],
		"short_name": "KC_MUTE"
	},
	"KC_AUDIO_VOL_UP": {
		"name": "Audio Volume Up",
		"description": "Audio Volume Up",
		"keycode": "0xA9",
		"label": [ "volume up", "volumeup", "vol up", "volup", "vol_up" ],
		"short_name": "KC_VOLU"
	},
	"KC_AUDIO_VOL_DOWN": {
		"name": "Audio Volume Down",
		"description": "Audio Volume Down",
		"keycode": "0xAA",
		"label": [ "volume down", "volumedown", "vol down", "voldown", "vol dn", "voldn", "vol_dn" ],
		"short_name": "KC_VOLD"
	},
	"KC_MEDIA_NEXT_TRACK": {
		"name": "Media Next Track",
		"description": "Media Next Track",
		"keycode": "0xAB",
		"label": [ "next track", "nexttrack", "next" ],
		"short_name": "KC_MNXT"
	},
	"KC_MEDIA_PREV_TRACK": {
		"name": "Media Previous Track",
		"description": "Media Previous Track",
		"keycode": "0xAC",
		"label": [ "previous track", "prevtrack", "previous", "prev" ],
		"short_name": "KC_MPRV"
	},
	"KC_MEDIA_FAST_FORWARD": {
		"name": "Media Fast Forward",
		"description": "Media Fast Forward",
		"keycode": "0xAD",
		"label": [ "apple next", "fast forward", "fastforward", "ffwd" ],
		"short_name": "KC_MFFD"
	},
	"KC_MEDIA_REWIND": {
		"name": "Media Rewind",
		"description": "Media Rewind",
		"keycode": "0xAE",
		"label": [ "apple prev", "rewind", "rwd" ],
		"short_name": "KC_MRWD"
	},
	"KC_MEDIA_STOP": {
		"name": "Media Stop",
		"description": "Media Stop",
		"keycode": "0xAF",
		"label": [ "stop" ],
		"label_priority": [ "stop" ],
		"short_name": "KC_MSTP"
	},
	"KC_MEDIA_PLAY_PAUSE": {
		"name": "Media Play/Pause",
		"description": "Media Play/Pause",
		"keycode": "0xB0",
		"label": [ "play", "apple play" ],
		"short_name": "KC_MPLY"
	},
	"KC_MEDIA_SELECT": {
		"name": "Media Select",
		"description": "Media Select",
		"keycode": "0xB1",
		"label": [ "select" ],
		"label_priority": [ "select" ],
		"short_name": "KC_MSEL"
	},
	"KC_MEDIA_EJECT": {
		"name": "Media Eject",
		"description": "Media Eject",
		"keycode": "0xB2",
		"label": [ "eject" ],
		"short_name": "KC_EJCT"
	},
	"KC_MAIL": {
		"name": "Mail",
		"description": "Mail",
		"keycode": "0xB3",
		"label": [ "mail" ],
		"short_name": "KC_MAIL"
	},
	"KC_CALCULATOR": {
		"name": "Calculator",
		"description": "Calculator",
		"keycode": "0xB4",
		"label": [ "calc", "cal" ],
		"short_name": "KC_CALC"
	},
	"KC_MY_COMPUTER": {
		"name": "My Computer",
		"description": "My Computer",
		"keycode": "0xB5",
		"label": [ "my computer", "mycomp" ],
		"short_name": "KC_MYCM"
	},
	"KC_WWW_SEARCH": {
		"name": "WWW Search",
		"description": "WWW Search",
		"keycode": "0xB6",
		"label": [ "www search", "wwwsearch", "wsearch" ],
		"short_name": "KC_WSCH"
	},
	"KC_WWW_HOME": {
		"name": "WWW Home",
		"description": "WWW Home",
		"keycode": "0xB7",
		"label": [ "www home", "wwwhome", "whome" ],
		"short_name": "KC_WHOM"
	},
	"KC_WWW_BACK": {
		"name": "WWW Back",
		"description": "WWW Back",
		"keycode": "0xB8",
		"label": [ "www back", "wwwback", "wback" ],
		"short_name": "KC_WBAK"
	},
	"KC_WWW_FORWARD": {
		"name": "WWW Forward",
		"description": "WWW Forward",
		"keycode": "0xB9",
		"label": [ "www forward", "wwwforward", "wforward" ],
		"short_name": "KC_WFWD"
	},
	"KC_WWW_STOP": {
		"name": "WWW Stop",
		"description": "WWW Stop",
		"keycode": "0xBA",
		"label": [ "www stop", "wwwstop", "wstop" ],
		"short_name": "KC_WSTP"
	},
	"KC_WWW_REFRESH": {
		"name": "WWW Refresh",
		"description": "WWW Refresh",
		"keycode": "0xBB",
		"label": [ "www refresh", "wwwrefresh", "wrefresh" ],
		"short_name": "KC_WREF"
	},
	"KC_WWW_FAVORITES": {
		"name": "WWW Favorites",
		"description": "WWW Favorites",
		"keycode": "0xBC",
		"label": [ "www favorites", "wwwfavorites", "wfav" ],
		"short_name": "KC_WFAV"
	},
	
	/* Fn Key */
	"KC_FN0": {
		"name": "Fn Key 0",
		"description": "Fn Key 0",
		"keycode": "0xC0",
		"label": [ "fn0", "fn" ]
	},
	"KC_FN1": {
		"name": "Fn Key 1",
		"description": "Fn Key 1",
		"keycode": "0xC1",
		"label": [ "fn1" ]
	},
	"KC_FN2": {
		"name": "Fn Key 2",
		"description": "Fn Key 2",
		"keycode": "0xC2",
		"label": [ "fn2" ]
	},
	"KC_FN3": {
		"name": "Fn Key 3",
		"description": "Fn Key 3",
		"keycode": "0xC3",
		"label": [ "fn3" ]
	},
	"KC_FN4": {
		"name": "Fn Key 4",
		"description": "Fn Key 4",
		"keycode": "0xC4",
		"label": [ "fn4" ]
	},
	"KC_FN5": {
		"name": "Fn Key 5",
		"description": "Fn Key 5",
		"keycode": "0xC5",
		"label": [ "fn5" ]
	},
	"KC_FN6": {
		"name": "Fn Key 6",
		"description": "Fn Key 6",
		"keycode": "0xC6",
		"label": [ "fn6" ]
	},
	"KC_FN7": {
		"name": "Fn Key 7",
		"description": "Fn Key 7",
		"keycode": "0xC7",
		"label": [ "fn7" ]
	},
	"KC_FN8": {
		"name": "Fn Key 8",
		"description": "Fn Key 8",
		"keycode": "0xC8",
		"label": [ "fn8" ]
	},
	"KC_FN9": {
		"name": "Fn Key 9",
		"description": "Fn Key 9",
		"keycode": "0xC9",
		"label": [ "fn9" ]
	},
	"KC_FN10": {
		"name": "Fn Key 10",
		"description": "Fn Key 10",
		"keycode": "0xCA",
		"label": [ "fn10" ]
	},
	"KC_FN11": {
		"name": "Fn Key 11",
		"description": "Fn Key 11",
		"keycode": "0xCB",
		"label": [ "fn11" ]
	},
	"KC_FN12": {
		"name": "Fn Key 12",
		"description": "Fn Key 12",
		"keycode": "0xCC",
		"label": [ "fn12" ]
	},
	"KC_FN13": {
		"name": "Fn Key 13",
		"description": "Fn Key 13",
		"keycode": "0xCD",
		"label": [ "fn13" ]
	},
	"KC_FN14": {
		"name": "Fn Key 14",
		"description": "Fn Key 14",
		"keycode": "0xCE",
		"label": [ "fn14" ]
	},
	"KC_FN15": {
		"name": "Fn Key 15",
		"description": "Fn Key 15",
		"keycode": "0xCF",
		"label": [ "fn15" ]
	},
	"KC_FN16": {
		"name": "Fn Key 16",
		"description": "Fn Key 16",
		"keycode": "0xD0",
		"label": [ "fn16" ]
	},
	"KC_FN17": {
		"name": "Fn Key 17",
		"description": "Fn Key 17",
		"keycode": "0xD1",
		"label": [ "fn17" ]
	},
	"KC_FN18": {
		"name": "Fn Key 18",
		"description": "Fn Key 18",
		"keycode": "0xD2",
		"label": [ "fn18" ]
	},
	"KC_FN19": {
		"name": "Fn Key 19",
		"description": "Fn Key 19",
		"keycode": "0xD3",
		"label": [ "fn19" ]
	},
	"KC_FN20": {
		"name": "Fn Key 20",
		"description": "Fn Key 20",
		"keycode": "0xD4",
		"label": [ "fn20" ]
	},
	"KC_FN21": {
		"name": "Fn Key 21",
		"description": "Fn Key 21",
		"keycode": "0xD5",
		"label": [ "fn21" ]
	},
	"KC_FN22": {
		"name": "Fn Key 22",
		"description": "Fn Key 22",
		"keycode": "0xD6",
		"label": [ "fn22" ]
	},
	"KC_FN23": {
		"name": "Fn Key 23",
		"description": "Fn Key 23",
		"keycode": "0xD7",
		"label": [ "fn23" ]
	},
	"KC_FN24": {
		"name": "Fn Key 24",
		"description": "Fn Key 24",
		"keycode": "0xD8",
		"label": [ "fn24" ]
	},
	"KC_FN25": {
		"name": "Fn Key 25",
		"description": "Fn Key 25",
		"keycode": "0xD9",
		"label": [ "fn25" ]
	},
	"KC_FN26": {
		"name": "Fn Key 26",
		"description": "Fn Key 26",
		"keycode": "0xDA",
		"label": [ "fn26" ]
	},
	"KC_FN27": {
		"name": "Fn Key 27",
		"description": "Fn Key 27",
		"keycode": "0xDB",
		"label": [ "fn27" ]
	},
	"KC_FN28": {
		"name": "Fn Key 28",
		"description": "Fn Key 28",
		"keycode": "0xDC",
		"label": [ "fn28" ]
	},
	"KC_FN29": {
		"name": "Fn Key 29",
		"description": "Fn Key 29",
		"keycode": "0xDD",
		"label": [ "fn29" ]
	},
	"KC_FN30": {
		"name": "Fn Key 30",
		"description": "Fn Key 30",
		"keycode": "0xDE",
		"label": [ "fn30" ]
	},
	"KC_FN31": {
		"name": "Fn Key 31",
		"description": "Fn Key 31",
		"keycode": "0xDF",
		"label": [ "fn31" ]
	},
	/* Modifiers */
	"KC_LCTRL": {
		"name": "Left Control",
		"description": "Left Control",
		"keycode": "0xE0",
		"label": [ "control", "ctrl", "lcontrol", "lctrl" ],
		"label_priority": [ "control", "ctrl" ],
		"short_name": "KC_LCTL"
	},
	"KC_LSHIFT": {
		"name": "Left Shift",
		"description": "Left Shift",
		"keycode": "0xE1",
		"label": [ "shift", "lshift" ],
		"label_priority": [ "shift" ],
		"short_name": "KC_LSFT"
	},
	"KC_LALT": {
		"name": "Left Alt",
		"description": "Left Alt (Alt/Option Key)",
		"keycode": "0xE2",
		"label": [ "alt", "option", "opt", "lalt", "loption", "lopt" ],
		"label_priority": [ "alt", "option", "opt" ]
	},
	"KC_LGUI": {
		"name": "Left GUI",
		"description": "Left GUI (Windows/Apple/Meta key)",
		"keycode": "0xE3",
		"label": [ "gui", "win", "command", "comm", "meta", "lgui", "lwin", "lcommand", "lcomm", "lmeta" ],
		"label_priority": [ "gui", "win", "command", "comm", "meta" ]
	},
	"KC_RCTRL": {
		"name": "Right Ctonrol",
		"description": "Right Ctonrol",
		"keycode": "0xE4",
		"label": [ "control", "ctrl", "rcontrol", "rctrl" ],
		"short_name": "KC_RCTL"
	},
	"KC_RSHIFT": {
		"name": "Right Shift",
		"description": "Right Shift",
		"keycode": "0xE5",
		"label": [ "shift", "rshift" ],
		"short_name": "KC_RSFT"
	},
	"KC_RALT": {
		"name": "Right Alt",
		"description": "Right Alt (Alt/Option Key)",
		"keycode": "0xE6",
		"label": [ "alt", "option", "opt", "ralt", "roption", "ropt", "altgr" ]
	},
	"KC_RGUI": {
		"name": "Right GUI",
		"description": "Right GUI (Windows/Apple/Meta key)",
		"keycode": "0xE7",
		"label": [ "gui", "win", "command", "comm", "meta", "rgui", "rwin", "rcommand", "rcomm", "rmeta" ]
	},
	/* Mousekey */
	"KC_MS_UP": {
		"name": "Mouse Cursor Up",
		"description": "Mouse Cursor Up",
		"keycode": "0xF0",
		"label": [ "mouse up", "mouseup", "cursor up", "cursorup" ],
		"short_name": "KC_MS_U"
	},
	"KC_MS_DOWN": {
		"name": "Mouse Cursor Down",
		"description": "Mouse Cursor Down",
		"keycode": "0xF1",
		"label": [ "mouse down", "mousedown", "cursor down", "cursordown" ],
		"short_name": "KC_MS_D"
	},
	"KC_MS_LEFT": {
		"name": "Mouse Cursor Left",
		"description": "Mouse Cursor Left",
		"keycode": "0xF2",
		"label": [ "mouse left", "mouseleft", "cursor left", "cursorleft" ],
		"short_name": "KC_MS_L"
	},
	"KC_MS_RIGHT": {
		"name": "Mouse Cursor Right",
		"description": "Mouse Cursor Right",
		"keycode": "0xF3",
		"label": [ "mouse right", "mouseright", "cursor right", "cursorright" ],
		"short_name": "KC_MS_R"
	},
	"KC_MS_BTN1": {
		"name": "Mouse Button 1",
		"description": "Mouse Button 1",
		"keycode": "0xF4",
		"label": [ "button1", "btn1" ],
		"short_name": "KC_BTN1"
	},
	"KC_MS_BTN2": {
		"name": "Mouse Button 2",
		"description": "Mouse Button 2",
		"keycode": "0xF5",
		"label": [ "button2", "btn2" ],
		"short_name": "KC_BTN2"
	},
	"KC_MS_BTN3": {
		"name": "Mouse Button 3",
		"description": "Mouse Button 3",
		"keycode": "0xF6",
		"label": [ "button3", "btn3" ],
		"short_name": "KC_BTN3"
	},
	"KC_MS_BTN4": {
		"name": "Mouse Button 4",
		"description": "Mouse Button 4",
		"keycode": "0xF7",
		"label": [ "button4", "btn4" ],
		"short_name": "KC_BTN4"
	},
	"KC_MS_BTN5": {
		"name": "Mouse Button 5",
		"description": "Mouse Button 5",
		"keycode": "0xF8",
		"label": [ "button5", "btn5" ],
		"short_name": "KC_BTN5"
	},
	/* Mousekey wheel */
	"KC_MS_WH_UP": {
		"name": "Mouse Wheel Up",
		"description": "Mouse Wheel Up",
		"keycode": "0xF9",
		"label": [ "wheel up", "wheelup" ],
		"short_name": "KC_WH_U"
	},
	"KC_MS_WH_DOWN": {
		"name": "Mouse Wheel Down",
		"description": "Mouse Wheel Down",
		"keycode": "0xFA",
		"label": [ "wheel down", "wheeldown" ],
		"short_name": "KC_WH_D"
	},
	"KC_MS_WH_LEFT": {
		"name": "Mouse Wheel Left",
		"description": "Mouse Wheel Left",
		"keycode": "0xFB",
		"label": [ "wheel left", "wheelleft" ],
		"short_name": "KC_WH_L"
	},
	"KC_MS_WH_RIGHT": {
		"name": "Mouse Wheel Right",
		"description": "Mouse Wheel Right",
		"keycode": "0xFC",
		"label": [ "wheel right", "wheelright" ],
		"short_name": "KC_WH_R"
	},
	/* Mousekey accel */
	"KC_MS_ACCEL0": {
		"name": "Mouse Acceleration 0",
		"description": "Mouse Acceleration 0",
		"keycode": "0xFD",
		"label": [ "accel0" ],
		"short_name": "KC_ACL0"
	},
	"KC_MS_ACCEL1": {
		"name": "Mouse Acceleration 1",
		"description": "Mouse Acceleration 1",
		"keycode": "0xFE",
		"label": [ "accel1" ],
		"short_name": "KC_ACL1"
	},
	"KC_MS_ACCEL2": {
		"name": "Mouse Acceleration 2",
		"description": "Mouse Acceleration 2",
		"keycode": "0xFF",
		"label": [ "accel2" ],
		"short_name": "KC_ACL2"
	}
};
