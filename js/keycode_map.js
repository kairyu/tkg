var keycode_map = {
	"KC_NO": {
		"description": "Reserved (no event indicated)",
		"keycode": "0x00",
		"label": [ "no" ]
	},
	/*
	"KC_ROLL_OVER": {
		"description": "ErrorRollOver",
		"keycode": "0x01"
	},
	*/
	"KC_TRANSPARENT": {
		"description": "Transparent",
		"keycode": "0x01",
		"label": [ "" ],
		"label_priority": [ "" ],
		"short_name": "KC_TRNS"
	},
	"KC_POST_FAIL":	{
		"description": "POSTFail",
		"keycode": "0x02"
	},
	"KC_UNDEFINED": {
		"description": "ErrorUndefined",
		"keycode": "0x03"
	},
	"KC_A": {
		"description": "a and A",
		"keycode": "0x04",
		"label": [ "a" ]
	},
	"KC_B": {
		"description": "b and B",
		"keycode": "0x05",
		"label": [ "b" ]
	},
	"KC_C": {
		"description": "c and C",
		"keycode": "0x06",
		"label": [ "c" ]
	},
	"KC_D": {
		"description": "d and D",
		"keycode": "0x07",
		"label": [ "d" ]
	},
	"KC_E": {
		"description": "e and E",
		"keycode": "0x08",
		"label": [ "e" ]
	},
	"KC_F": {
		"description": "f and F",
		"keycode": "0x09",
		"label": [ "f" ]
	},
	"KC_G": {
		"description": "g and G",
		"keycode": "0x0A",
		"label": [ "g" ]
	},
	"KC_H": {
		"description": "h and H",
		"keycode": "0x0B",
		"label": [ "h" ]
	},
	"KC_I": {
		"description": "i and I",
		"keycode": "0x0C",
		"label": [ "i" ]
	},
	"KC_J": {
		"description": "j and J",
		"keycode": "0x0D",
		"label": [ "j" ]
	},
	"KC_K": {
		"description": "k and K",
		"keycode": "0x0E",
		"label": [ "k" ]
	},
	"KC_L": {
		"description": "l and L",
		"keycode": "0x0F",
		"label": [ "l" ]
	},
	"KC_M": {
		"description": "m and M",
		"keycode": "0x10",
		"label": [ "m" ]
	},
	"KC_N": {
		"description": "n and N",
		"keycode": "0x11",
		"label": [ "n" ]
	},
	"KC_O": {
		"description": "o and O",
		"keycode": "0x12",
		"label": [ "o" ]
	},
	"KC_P": {
		"description": "p and P",
		"keycode": "0x13",
		"label": [ "p" ]
	},
	"KC_Q": {
		"description": "q and Q",
		"keycode": "0x14",
		"label": [ "q" ]
	},
	"KC_R": {
		"description": "r and R",
		"keycode": "0x15",
		"label": [ "r" ]
	},
	"KC_S": {
		"description": "s and S",
		"keycode": "0x16",
		"label": [ "s" ]
	},
	"KC_T": {
		"description": "t and T",
		"keycode": "0x17",
		"label": [ "t" ]
	},
	"KC_U": {
		"description": "u and U",
		"keycode": "0x18",
		"label": [ "u" ]
	},
	"KC_V": {
		"description": "v and V",
		"keycode": "0x19",
		"label": [ "v" ]
	},
	"KC_W": {
		"description": "w and W",
		"keycode": "0x1A",
		"label": [ "w" ]
	},
	"KC_X": {
		"description": "x and X",
		"keycode": "0x1B",
		"label": [ "x" ]
	},
	"KC_Y": {
		"description": "y and Y",
		"keycode": "0x1C",
		"label": [ "y" ]
	},
	"KC_Z": {
		"description": "z and Z",
		"keycode": "0x1D",
		"label": [ "z" ]
	},
	"KC_1": {
		"description": "1 and !",
		"keycode": "0x1E",
		"label": [ "!" ],
		"label_2": [ "1" ]
	},
	"KC_2": {
		"description": "2 and @",
		"keycode": "0x1F",
		"label": [ "@", "\"" ],
		"label_2": [ "2" ]
	},
	"KC_3": {
		"description": "3 and #",
		"keycode": "0x20",
		"label": [ "#", "£" ],
		"label_2": [ "3" ]
	},
	"KC_4": {
		"description": "4 and $",
		"keycode": "0x21",
		"label": [ "$" ],
		"label_2": [ "4" ]
	},
	"KC_5": {
		"description": "5 and %",
		"keycode": "0x22",
		"label": [ "%" ],
		"label_2": [ "5" ]
	},
	"KC_6": {
		"description": "6 and ^",
		"keycode": "0x23",
		"label": [ "^", "&" ],
		"label_2": [ "6" ]
	},
	"KC_7": {
		"description": "7 and &",
		"keycode": "0x24",
		"label": [ "&", "'" ],
		"label_2": [ "7" ]
	},
	"KC_8": {
		"description": "8 and *",
		"keycode": "0x25",
		"label": [ "*", "(" ],
		"label_2": [ "8" ]
	},
	"KC_9": {
		"description": "9 and (",
		"keycode": "0x26",
		"label": [ "(", ")" ],
		"label_2": [ "9" ]
	},
	"KC_0": {
		"description": "0 and )",
		"keycode": "0x27",
		"label": [ ")", "" ],
		"label_2": [ "0" ]
	},
	"KC_ENTER": {
		"description": "Return (ENTER)",
		"keycode": "0x28",
		"label": [ "enter", "return" ],
		"label_priority": [ "enter", "return" ],
		"short_name": "KC_ENT"
	},
	"KC_ESCAPE": {
		"description": "ESCAPE",
		"keycode": "0x29",
		"label": [ "escape", "esc" ],
		"short_name": "KC_ESC"
	},
	"KC_BSPACE": {
		"description": "DELETE (Backspace)",
		"keycode": "0x2A",
		"label": [ "delete", "backspace", "back space", "bs" ],
		"short_name": "KC_BSPC"
	},
	"KC_TAB": {
		"description": "Tab",
		"keycode": "0x2B",
		"label": [ "tab" ]
	},
	"KC_SPACE": {
		"description": "Spacebar",
		"keycode": "0x2C",
		"label": [ "spacebar", "space", "spc", "" ],
		"short_name": "KC_SPC"
	},
	"KC_MINUS": {
		"description": "- and _",
		"keycode": "0x2D",
		"label": [ "_", "&mdash;", "=" ],
		"label_2": [ "-", "&ndash;" ],
		"short_name": "KC_MINS"
	},
	"KC_EQUAL": {
		"description": "= and +",
		"keycode": "0x2E",
		"label": [ [ "+" ], [ "~" ] ],
		"label_2": [ [ "=" ], [ "^" ] ],
		"short_name": "KC_EQL"
	},
	"KC_LBRACKET": {
		"description": "[ and {",
		"keycode": "0x2F",
		"label": [ "{" ],
		"label_2": [ "[" ],
		"short_name": "KC_LBRC"
	},
	"KC_RBRACKET": {
		"description": "] and }",
		"keycode": "0x30",
		"label": [ "}" ],
		"label_2": [ "]" ],
		"short_name": "KC_RBRC"
	},
	"KC_BSLASH": {
		"description": "\\ and |",
		"keycode": "0x31",
		"label": [ "|" ],
		"label_2": [ "\\" ],
		"label_priority": [ "|" ],
		"short_name": "KC_BSLS"
	},
	"KC_NONUS_HASH": {
		"description": "Non-US # and ~",
		"keycode": "0x32",
		"label": [ "~" ],
		"label_2": [ "#" ],
		"short_name": "KC_NUHS"
	},
	"KC_SCOLON": {
		"description": "; and :",
		"keycode": "0x33",
		"label": [ [ ":" ], [ "*" ] ],
		"label_2": [ [ ";" ], [ ":" ] ],
		"short_name": "KC_SCLN"
	},
	"KC_QUOTE": {
		"description": "' and \"",
		"keycode": "0x34",
		"label": [ [ "\"", "@" ], [ "+" ] ],
		"label_2": [ [ "'" ], [ ";" ] ],
		"short_name": "KC_QUOT"
	},
	"KC_GRAVE": {
		"description": "`(grave accent) and ~(tilde)",
		"keycode": "0x35",
		"label": [ "~", "¬" ],
		"label_2": [ "`" ],
		"short_name": "KC_GRV"
	},
	"KC_COMMA": {
		"description": ", and <",
		"keycode": "0x36",
		"label": [ "<" ],
		"label_2": [ "," ],
		"short_name": "KC_COMM"
	},
	"KC_DOT": {
		"description": ". and >",
		"keycode": "0x37",
		"label": [ ">" ],
		"label_2": [ "." ]
	},
	"KC_SLASH": {
		"description": "/ and ?",
		"keycode": "0x38",
		"label": [ "?" ],
		"label_2": [ "/" ],
		"short_name": "KC_SLSH"
	},
	"KC_CAPSLOCK": {
		"description": "Caps Lock",
		"keycode": "0x39",
		"label": [ "capslock", "caps lock", "caps" ],
		"short_name": "KC_CAPS"
	},
	"KC_F1": {
		"description": "F1",
		"keycode": "0x3A",
		"label": [ "f1" ]
	},
	"KC_F2": {
		"description": "F2",
		"keycode": "0x3B",
		"label": [ "f2" ]
	},
	"KC_F3": {
		"description": "F3",
		"keycode": "0x3C",
		"label": [ "f3" ]
	},
	"KC_F4": {
		"description": "F4",
		"keycode": "0x3D",
		"label": [ "f4" ]
	},
	"KC_F5": {
		"description": "F5",
		"keycode": "0x3E",
		"label": [ "f5" ]
	},
	"KC_F6": {
		"description": "F6",
		"keycode": "0x3F",
		"label": [ "f6" ]
	},
	"KC_F7": {
		"description": "F7",
		"keycode": "0x40",
		"label": [ "f7" ]
	},
	"KC_F8": {
		"description": "F8",
		"keycode": "0x41",
		"label": [ "f8" ]
	},
	"KC_F9": {
		"description": "F9",
		"keycode": "0x42",
		"label": [ "f9" ]
	},
	"KC_F10": {
		"description": "F10",
		"keycode": "0x43",
		"label": [ "f10" ]
	},
	"KC_F11": {
		"description": "F11",
		"keycode": "0x44",
		"label": [ "f11" ]
	},
	"KC_F12": {
		"description": "F12",
		"keycode": "0x45",
		"label": [ "f12" ]
	},
	"KC_PSCREEN": {
		"description": "PrintScreen",
		"keycode": "0x46",
		"label": [ "printscreen", "print screen", "prtsc", "print" ],
		"short_name": "KC_PSCR"
	},
	"KC_SCROLLLOCK": {
		"description": "Scroll Lock",
		"keycode": "0x47",
		"label": [ "scroll lock", "scrolllock", "scrlc" ],
		"short_name": "KC_SLCK"
	},
	"KC_PAUSE": {
		"description": "Pause and Break",
		"keycode": "0x48",
		"label": [ "pause" ],
		"label_2": [ "break" ],
		"short_name": "KC_PAUS"
	},
	"KC_INSERT": {
		"description": "Insert",
		"keycode": "0x49",
		"label": [ "insert", "ins" ],
		"short_name": "KC_INT"
	},
	"KC_HOME": {
		"description": "Home",
		"keycode": "0x4A",
		"label": [ "home" ]
	},
	"KC_PGUP": {
		"description": "PageUp",
		"keycode": "0x4B",
		"label": [ "pageup", "page up", "pgup" ]
	},
	"KC_DELETE": {
		"description": "Delete Forward",
		"keycode": "0x4C",
		"label": [ "delete", "del" ],
		"label_priority": [ "delete" ],
		"short_name": "KC_DEL"
	},
	"KC_END": {
		"description": "End",
		"keycode": "0x4D",
		"label": [ "end" ]
	},
	"KC_PGDOWN": {
		"description": "PageDown",
		"keycode": "0x4E",
		"label": [ "pagedown", "page down", "pgdn" ],
		"short_name": "KC_PGDN"
	},
	"KC_RIGHT": {
		"description": "RightArrow",
		"keycode": "0x4F",
		"label": [ "right", "→", "&#9656;" ],
		"short_name": "KC_RGHT"
	},
	"KC_LEFT": {
		"description": "LeftArrow",
		"keycode": "0x50",
		"label": [ "left", "←", "&#9666;" ]
	},
	"KC_DOWN": {
		"description": "DownArrow",
		"keycode": "0x51",
		"label": [ "down", "↓", "&#9662;" ]
	},
	"KC_UP": {
		"description": "UpArrow",
		"keycode": "0x52",
		"label": [ "up", "↑", "&#9652;" ]
	},
	"KC_NUMLOCK": {
		"description": "Num Lock and Clear",
		"keycode": "0x53",
		"label": [ "num lock", "numlock", "nmlck" ],
		"short_name": "KC_NLCK"
	},
	"KC_KP_SLASH": {
		"description": "Keypad /",
		"keycode": "0x54",
		"label": [ [ "/" ], [ "p/" ] ],
		"label_2": [ [ "" ], [] ],
		"short_name": "KC_PSLS"
	},
	"KC_KP_ASTERISK": {
		"description": "Keypad *",
		"keycode": "0x55",
		"label": [ [ "*" ], [ "p*" ] ],
		"label_2": [ [ "" ], [] ],
		"short_name": "KC_PAST"
	},
	"KC_KP_MINUS": {
		"description": "Keypad -",
		"keycode": "0x56",
		"label": [ [ "-", "&ndash;" ], [ "p-" ] ],
		"label_2": [ [ "" ], [] ],
		"short_name": "KC_PMNS"
	},
	"KC_KP_PLUS": {
		"description": "Keypad +",
		"keycode": "0x57",
		"label": [ [ "+" ], [ "p+" ] ],
		"label_2": [ [ "" ], [] ],
		"short_name": "KC_PPLS"
	},
	"KC_KP_ENTER": {
		"description": "Keypad ENTER",
		"keycode": "0x58",
		"label": [ [ "enter" ], [ "penter" ] ],
		"label_2": [ [ "" ], [] ],
		"short_name": "KC_PENT"
	},
	"KC_KP_1": {
		"description": "Keypad 1 and End",
		"keycode": "0x59",
		"label": [ [ "1" ], [ "p1" ] ],
		"label_2": [ [ "end" ], [] ],
		"short_name": "KC_P1"
	},
	"KC_KP_2": {
		"description": "Keypad 2 and DownArrow",
		"keycode": "0x5A",
		"label": [ [ "2" ], [ "p2" ] ],
		"label_2": [ [ "down", "↓" ], [] ],
		"short_name": "KC_P1"
	},
	"KC_KP_3": {
		"description": "Keypad 3 and PageDown",
		"keycode": "0x5B",
		"label": [ [ "3" ], [ "p3" ] ],
		"label_2": [ [ "pagedown", "page down", "pgdn" ], [] ],
		"short_name": "KC_P3"
	},
	"KC_KP_4": {
		"description": "Keypad 4 and LeftArrow",
		"keycode": "0x5C",
		"label": [ [ "4" ], [ "p4" ] ],
		"label_2": [ [ "left", "←" ], [] ],
		"short_name": "KC_P4"
	},
	"KC_KP_5": {
		"description": "Keypad 5",
		"keycode": "0x5D",
		"label": [ [ "5" ], [ "p5" ] ],
		"label_2": [ [ "" ], [] ],
		"short_name": "KC_P5"
	},
	"KC_KP_6": {
		"description": "Keypad 6 and RightArrow",
		"keycode": "0x5E",
		"label": [ [ "6" ], [ "p6" ] ],
		"label_2": [ [ "right", "→" ], [] ],
		"short_name": "KC_P1"
	},
	"KC_KP_7": {
		"description": "Keypad 7 and Home",
		"keycode": "0x5F",
		"label": [ [ "7" ], [ "p7" ] ],
		"label_2": [ [ "home" ], [] ],
		"short_name": "KC_P7"
	},
	"KC_KP_8": {
		"description": "Keypad 8 and UpArrow",
		"keycode": "0x60",
		"label": [ [ "8" ], [ "p8" ] ],
		"label_2": [ [ "up", "↑" ], [] ],
		"short_name": "KC_P8"
	},
	"KC_KP_9": {
		"description": "Keypad 9 and PageUp",
		"keycode": "0x61",
		"label": [ [ "9" ], [ "p9" ] ],
		"label_2": [ [ "pageup", "page up", "pgup" ], [] ],
		"short_name": "KC_P9"
	},
	"KC_KP_0": {
		"description": "Keypad 0 and Insert",
		"keycode": "0x62",
		"label": [ [ "0" ], [ "p0" ] ],
		"label_2": [ [ "insert", "ins" ], [] ],
		"short_name": "KC_P0"
	},
	"KC_KP_DOT": {
		"description": "Keypad . and Delete",
		"keycode": "0x63",
		"label": [ [ "." ], [ "p." ] ],
		"label_2": [ [ "delete", "del" ], [] ],
		"short_name": "KC_PDOT"
	},
	"KC_NONUS_BSLASH": {
		"description": "Non-US \\ and |",
		"keycode": "0x64",
		"label": [ "|" ],
		"label_2": [ "\\" ],
		"short_name": "KC_NUBS"
	},
	"KC_APPLICATION": {
		"description": "Application",
		"keycode": "0x65",
		"label": [ "app", "menu" ],
		"label_priority": [ "menu" ],
		"short_name": "KC_APP"
	},
	"KC_POWER": {
		"description": "Power",
		"keycode": "0x66"
	},
	"KC_KP_EQUAL": {
		"description": "Keypad =",
		"keycode": "0x67",
		"label": [ [ "=" ], [ "p=" ] ],
		"label_2": [ [ "" ], [] ],
		"short_name": "KC_PEQL"
	},
	"KC_F13": {
		"description": "F13",
		"keycode": "0x68",
		"label": [ "f13" ]
	},
	"KC_F14": {
		"description": "F14",
		"keycode": "0x69",
		"label": [ "f14" ]
	},
	"KC_F15": {
		"description": "F15",
		"keycode": "0x6A",
		"label": [ "f15" ]
	},
	"KC_F16": {
		"description": "F16",
		"keycode": "0x6B",
		"label": [ "f16" ]
	},
	"KC_F17": {
		"description": "F17",
		"keycode": "0x6C",
		"label": [ "f17" ]
	},
	"KC_F18": {
		"description": "F18",
		"keycode": "0x6D",
		"label": [ "f18" ]
	},
	"KC_F19": {
		"description": "F19",
		"keycode": "0x6E",
		"label": [ "f19" ]
	},
	"KC_F20": {
		"description": "F20",
		"keycode": "0x6F",
		"label": [ "f20" ]
	},
	"KC_F21": {
		"description": "F21",
		"keycode": "0x70",
		"label": [ "f21" ]
	},
	"KC_F22": {
		"description": "F22",
		"keycode": "0x71",
		"label": [ "f22" ]
	},
	"KC_F23": {
		"description": "F23",
		"keycode": "0x72",
		"label": [ "f23" ]
	},
	"KC_F24": {
		"description": "F24",
		"keycode": "0x73",
		"label": [ "f24" ]
	},
	"KC_EXECUTE": {
		"description": "Excute",
		"keycode": "0x74",
		"label": [ "excute" ]
	},
	"KC_HELP": {
		"description": "Help",
		"keycode": "0x75",
		"label": [ "help" ]
	},
	"KC_MENU": {
		"description": "Menu",
		"keycode": "0x76",
		"label": [ "menu" ]
	},
	"KC_SELECT": {
		"description": "Select,",
		"keycode": "0x77",
		"label": [ "select" ]
	},
	"KC_STOP": {
		"description": "Stop",
		"keycode": "0x78",
		"label": [ "stop" ]
	},
	"KC_AGAIN": {
		"description": "Again",
		"keycode": "0x79",
		"label": [ "again" ]
	},
	"KC_UNDO": {
		"description": "Undo",
		"keycode": "0x7A",
		"label": [ "undo" ]
	},
	"KC_CUT": {
		"description": "Cut",
		"keycode": "0x7B",
		"label": [ "cut" ]
	},
	"KC_COPY": {
		"description": "Copy",
		"keycode": "0x7C",
		"label": [ "copy" ]
	},
	"KC_PASTE": {
		"description": "Paste",
		"keycode": "0x7D",
		"label": [ "paste" ]
	},
	"KC_FIND": {
		"description": "Find",
		"keycode": "0x7E",
		"label": [ "find" ]
	},
	"KC__MUTE": {
		"description": "Mute",
		"keycode": "0x7F"
	},
	"KC__VOLUP": {
		"description": "Volume Up",
		"keycode": "0x80"
	},
	"KC__VOLDOWN": {
		"description": "Volumn Down",
		"keycode": "0x82"
	},
	"KC_LOCKING_CAPS": {
		"description": "Locking Caps Lock",
		"keycode": "0x82",
		"label": [ "locking caps lock" ],
	},
	"KC_LOCKING_NUM": {
		"description": "Locking Nums Lock",
		"keycode": "0x83",
		"label": [ "locking nums lock" ],
	},
	"KC_LOCKING_SCROLL": {
		"description": "Locking Scroll Lock",
		"keycode": "0x84",
		"label": [ "locking scroll lock" ],
	},
	"KC_KP_COMMA": {
		"description": "Keypad ,(Comma)",
		"keycode": "0x85",
		"label": [ [ "," ], [ "p," ] ],
		"label_2": [ [ "" ], [] ],
		"short_name": "KC_PCMM"
	},
	"KC_KP_EQUAL_AS400": {
		"description": "Keypad Equal Sign on AS/400",
		"keycode": "0x86",
		"label": [ "equal sign on as/400" ]
	},
	"KC_INT1": {
		"description": "International1",
		"keycode": "0x87",
		"label": [ "int1", "romaji", "eisu", "e/j" ],
		"short_name": "KC_RO"
	},
	"KC_INT2": {
		"description": "International2",
		"keycode": "0x88",
		"label": [ "int2", "kana" ],
		"short_name": "KC_KANA"
	},
	"KC_INT3": {
		"description": "International3",
		"keycode": "0x89",
		"label": [ "int3", "yen", "¥" ],
		"short_name": "KC_JYEN"
	},
	"KC_INT4": {
		"description": "International4",
		"keycode": "0x8A",
		"label": [ "int4", "henkan" ],
		"short_name": "KC_HENK"
	},
	"KC_INT5": {
		"description": "International5",
		"keycode": "0x8B",
		"label": [ "int5", "muhenkan" ],
		"short_name": "KC_MHEN"
	},
	"KC_INT6": {
		"description": "International6",
		"keycode": "0x8C",
		"label": [ "int6" ]
	},
	"KC_INT7": {
		"description": "International7",
		"keycode": "0x8D",
		"label": [ "int7" ]
	},
	"KC_INT8": {
		"description": "International8",
		"keycode": "0x8E",
		"label": [ "int8" ]
	},
	"KC_INT9": {
		"description": "International9",
		"keycode": "0x8F",
		"label": [ "int9" ]
	},
	"KC_LANG1": {
		"description": "LANG1",
		"keycode": "0x90",
		"label": [ "lang1" ]
	},
	"KC_LANG2": {
		"description": "LANG2",
		"keycode": "0x91",
		"label": [ "lang2" ]
	},
	"KC_LANG3": {
		"description": "LANG3",
		"keycode": "0x92",
		"label": [ "lang3" ]
	},
	"KC_LANG4": {
		"description": "LANG4",
		"keycode": "0x93",
		"label": [ "lang4" ]
	},
	"KC_LANG5": {
		"description": "LANG5",
		"keycode": "0x94",
		"label": [ "lang5" ]
	},
	"KC_LANG6": {
		"description": "LANG6",
		"keycode": "0x95",
		"label": [ "lang6" ]
	},
	"KC_LANG7": {
		"description": "LANG7",
		"keycode": "0x96",
		"label": [ "lang7" ]
	},
	"KC_LANG8": {
		"description": "LANG8",
		"keycode": "0x97",
		"label": [ "lang8" ]
	},
	"KC_LANG9": {
		"description": "LANG9",
		"keycode": "0x98",
		"label": [ "lang9" ]
	},
	"KC_ALT_ERASE": {
		"description": "Alternate Erase",
		"keycode": "0x99"
	},
	"KC_SYSREQ": {
		"description": "SysReq/Attention",
		"keycode": "0x9A",
	},
	"KC_CANCEL": {
		"description": "Cencel",
		"keycode": "0x9B"
	},
	"KC_CLEAR": {
		"description": "Clear",
		"keycode": "0x9C"
	},
	"KC_PRIOR": {
		"description": "Prior",
		"keycode": "0x9D"
	},
	"KC_RETURN": {
		"description": "Return",
		"keycode": "0x9E"
	},
	"KC_SEPARATOR": {
		"description": "Separator",
		"keycode": "0x9F"
	},
	"KC_OUT": {
		"description": "Out",
		"keycode": "0xA0"
	},
	"KC_OPER": {
		"description": "Oper",
		"keycode": "0xA1"
	},
	"KC_CLEAR_AGAIN": {
		"description": "Clear/Again",
		"keycode": "0xA2"
	},
	"KC_CRSEL": {
		"description": "CrSel/Props",
		"keycode": "0xA3"
	},
	"KC_EXSEL": {
		"description": "ExSel",
		"keycode": "0xA4"
	},
	/* System Control */
	"KC_SYSTEM_POWER": {
		"description": "System Power Down",
		"keycode": "0xA5",
		"label": [ "power", "pow", "pwr" ],
		"short_name": "KC_PWR"
	},
	"KC_SYSTEM_SLEEP": {
		"description": "System Sleep",
		"keycode": "0xA6",
		"label": [ "sleep", "slp" ],
		"short_name": "KC_SLEP"
	},
	"KC_SYSTEM_WAKE": {
		"description": "System Wake",
		"keycode": "0xA7",
		"label": [ "wake" ],
		"short_name": "KC_WAKE"
	},
	/* Media Control */
	"KC_AUDIO_MUTE": {
		"description": "Audio Mute",
		"keycode": "0xA8",
		"label": [ "mute" ],
		"short_name": "KC_MUTE"
	},
	"KC_AUDIO_VOL_UP": {
		"description": "Audio Volume Up",
		"keycode": "0xA9",
		"label": [ "volume up", "volumeup", "vol up", "volup" ],
		"short_name": "KC_VOLU"
	},
	"KC_AUDIO_VOL_DOWN": {
		"description": "Audio Volume Down",
		"keycode": "0xAA",
		"label": [ "volume down", "volumedown", "vol down", "voldown", "voldn" ],
		"short_name": "KC_VOLD"
	},
	"KC_MEDIA_NEXT_TRACK": {
		"description": "Media Next Track",
		"keycode": "0xAB",
		"label": [ "next track", "nexttrack", "next" ],
		"short_name": "KC_MNXT"
	},
	"KC_MEDIA_PREV_TRACK": {
		"description": "Media Previous Track",
		"keycode": "0xAC",
		"label": [ "previous track", "prevtrack", "previous", "prev" ],
		"short_name": "KC_MPRV"
	},
	"KC_MEDIA_STOP": {
		"description": "Media Stop",
		"keycode": "0xAD",
		"label": [ "stop" ],
		"short_name": "KC_MSTP"
	},
	"KC_MEDIA_PLAY_PAUSE": {
		"description": "Media Play/Pause",
		"keycode": "0xAE",
		"label": [ "play" ],
		"short_name": "KC_MPLY"
	},
	"KC_MEDIA_SELECT": {
		"description": "Media Select",
		"keycode": "0xAF",
		"label": [ "select" ],
		"short_name": "KC_MSEL"
	},
	"KC_MEDIA_EJECT": {
		"description": "Media Eject",
		"keycode": "0xB0",
		"label": [ "eject" ],
		"short_name": "KC_EJCT"
	},
	"KC_MAIL": {
		"description": "Mail",
		"keycode": "0xB1",
		"label": [ "mail" ],
		"short_name": "KC_MAIL"
	},
	"KC_CALCULATOR": {
		"description": "Calculator",
		"keycode": "0xB2",
		"label": [ "calc", "cal" ],
		"short_name": "KC_CALC"
	},
	"KC_MY_COMPUTER": {
		"description": "My Computer",
		"keycode": "0xB3",
		"label": [ "my computer", "mycomp" ],
		"short_name": "KC_MYCM"
	},
	"KC_WWW_SEARCH": {
		"description": "WWW Search",
		"keycode": "0xB4",
		"label": [ "www search", "wwwsearch", "wsearch" ],
		"short_name": "KC_WSCH"
	},
	"KC_WWW_HOME": {
		"description": "WWW Home",
		"keycode": "0xB5",
		"label": [ "www home", "wwwhome", "whome" ],
		"short_name": "KC_WHOM"
	},
	"KC_WWW_BACK": {
		"description": "WWW Back",
		"keycode": "0xB6",
		"label": [ "www back", "wwwback", "wback" ],
		"short_name": "KC_WBAK"
	},
	"KC_WWW_FORWARD": {
		"description": "WWW Forward",
		"keycode": "0xB7",
		"label": [ "www forward", "wwwforward", "wforward" ],
		"short_name": "KC_WFWD"
	},
	"KC_WWW_STOP": {
		"description": "WWW Stop",
		"keycode": "0xB8",
		"label": [ "www stop", "wwwstop", "wstop" ],
		"short_name": "KC_WSTP"
	},
	"KC_WWW_REFRESH": {
		"description": "WWW Refresh",
		"keycode": "0xB9",
		"label": [ "www refresh", "wwwrefresh", "wrefresh" ],
		"short_name": "KC_WREF"
	},
	"KC_WWW_FAVORITES": {
		"description": "WWW Favorites",
		"keycode": "0xBA",
		"label": [ "www favorites", "wwwfavorites", "wfav" ],
		"short_name": "KC_WFAV"
	},
	/* Fn Key */
	"KC_FN0": {
		"description": "Fn Key 0",
		"keycode": "0xC0",
		"label": [ "fn0" ]
	},
	"KC_FN1": {
		"description": "Fn Key 1",
		"keycode": "0xC1",
		"label": [ "fn1" ]
	},
	"KC_FN2": {
		"description": "Fn Key 2",
		"keycode": "0xC2",
		"label": [ "fn2" ]
	},
	"KC_FN3": {
		"description": "Fn Key 3",
		"keycode": "0xC3",
		"label": [ "fn3" ]
	},
	"KC_FN4": {
		"description": "Fn Key 4",
		"keycode": "0xC4",
		"label": [ "fn4" ]
	},
	"KC_FN5": {
		"description": "Fn Key 5",
		"keycode": "0xC5",
		"label": [ "fn5" ]
	},
	"KC_FN6": {
		"description": "Fn Key 6",
		"keycode": "0xC6",
		"label": [ "fn6" ]
	},
	"KC_FN7": {
		"description": "Fn Key 7",
		"keycode": "0xC7",
		"label": [ "fn7" ]
	},
	"KC_FN8": {
		"description": "Fn Key 8",
		"keycode": "0xC8",
		"label": [ "fn8" ]
	},
	"KC_FN9": {
		"description": "Fn Key 9",
		"keycode": "0xC9",
		"label": [ "fn9" ]
	},
	"KC_FN10": {
		"description": "Fn Key 10",
		"keycode": "0xCA",
		"label": [ "fn10" ]
	},
	"KC_FN11": {
		"description": "Fn Key 11",
		"keycode": "0xCB",
		"label": [ "fn11" ]
	},
	"KC_FN12": {
		"description": "Fn Key 12",
		"keycode": "0xCC",
		"label": [ "fn12" ]
	},
	"KC_FN13": {
		"description": "Fn Key 13",
		"keycode": "0xCD",
		"label": [ "fn13" ]
	},
	"KC_FN14": {
		"description": "Fn Key 14",
		"keycode": "0xCE",
		"label": [ "fn14" ]
	},
	"KC_FN15": {
		"description": "Fn Key 15",
		"keycode": "0xCF",
		"label": [ "fn15" ]
	},
	"KC_FN16": {
		"description": "Fn Key 16",
		"keycode": "0xD0",
		"label": [ "fn16" ]
	},
	"KC_FN17": {
		"description": "Fn Key 17",
		"keycode": "0xD1",
		"label": [ "fn17" ]
	},
	"KC_FN18": {
		"description": "Fn Key 18",
		"keycode": "0xD2",
		"label": [ "fn18" ]
	},
	"KC_FN19": {
		"description": "Fn Key 19",
		"keycode": "0xD3",
		"label": [ "fn19" ]
	},
	"KC_FN20": {
		"description": "Fn Key 20",
		"keycode": "0xD4",
		"label": [ "fn20" ]
	},
	"KC_FN21": {
		"description": "Fn Key 21",
		"keycode": "0xD5",
		"label": [ "fn21" ]
	},
	"KC_FN22": {
		"description": "Fn Key 22",
		"keycode": "0xD6",
		"label": [ "fn22" ]
	},
	"KC_FN23": {
		"description": "Fn Key 23",
		"keycode": "0xD7",
		"label": [ "fn23" ]
	},
	"KC_FN24": {
		"description": "Fn Key 24",
		"keycode": "0xD8",
		"label": [ "fn24" ]
	},
	"KC_FN25": {
		"description": "Fn Key 25",
		"keycode": "0xD9",
		"label": [ "fn25" ]
	},
	"KC_FN26": {
		"description": "Fn Key 26",
		"keycode": "0xDA",
		"label": [ "fn26" ]
	},
	"KC_FN27": {
		"description": "Fn Key 27",
		"keycode": "0xDB",
		"label": [ "fn27" ]
	},
	"KC_FN28": {
		"description": "Fn Key 28",
		"keycode": "0xDC",
		"label": [ "fn28" ]
	},
	"KC_FN29": {
		"description": "Fn Key 29",
		"keycode": "0xDD",
		"label": [ "fn29" ]
	},
	"KC_FN30": {
		"description": "Fn Key 30",
		"keycode": "0xDE",
		"label": [ "fn30" ]
	},
	"KC_FN31": {
		"description": "Fn Key 31",
		"keycode": "0xDF",
		"label": [ "fn31" ]
	},
	/* Modifiers */
	"KC_LCTRL": {
		"description": "Left Control",
		"keycode": "0xE0",
		"label": [ "control", "ctrl", "lcontrol", "lctrl" ],
		"label_priority": [ "control", "ctrl" ],
		"short_name": "KC_LCTL"
	},
	"KC_LSHIFT": {
		"description": "Left Shift",
		"keycode": "0xE1",
		"label": [ "shift", "lshift" ],
		"label_priority": [ "shift" ],
		"short_name": "KC_LSFT"
	},
	"KC_LALT": {
		"description": "Left Alt",
		"keycode": "0xE2",
		"label": [ "alt", "lalt" ],
		"label_priority": [ "alt" ]
	},
	"KC_LGUI": {
		"description": "Left GUI(Windows/Apple/Meta key)",
		"keycode": "0xE3",
		"label": [ "gui", "win", "command", "comm", "meta", "lgui", "lwin", "lcommand", "lcomm", "lmeta" ],
		"label_priority": [ "gui", "win", "command", "comm", "meta" ]
	},
	"KC_RCTRL": {
		"description": "Right Ctonrol",
		"keycode": "0xE4",
		"label": [ "control", "ctrl", "rcontrol", "rctrl" ],
		"short_name": "KC_RCTL"
	},
	"KC_RSHIFT": {
		"description": "Right Shift",
		"keycode": "0xE5",
		"label": [ "shift", "rshift" ],
		"short_name": "KC_RSFT"
	},
	"KC_RALT": {
		"description": "Right Alt",
		"keycode": "0xE6",
		"label": [ "alt", "ralt", "altgr" ]
	},
	"KC_RGUI": {
		"description": "Right GUI(Windows/Apple/Meta key)",
		"keycode": "0xE7",
		"label": [ "gui", "win", "command", "comm", "meta", "rgui", "rwin", "rcommand", "rcomm", "rmeta" ]
	},
	/* Mousekey */
	"KC_MS_UP": {
		"description": "Mouse Cursor Up",
		"keycode": "0xF0",
		"label": [ "mouse up", "mouseup", "cursor up", "cursorup" ],
		"short_name": "KC_MS_U"
	},
	"KC_MS_DOWN": {
		"description": "Mouse Cursor Down",
		"keycode": "0xF1",
		"label": [ "mouse down", "mousedown", "cursor down", "cursordown" ],
		"short_name": "KC_MS_D"
	},
	"KC_MS_LEFT": {
		"description": "Mouse Cursor Left",
		"keycode": "0xF2",
		"label": [ "mouse left", "mouseleft", "cursor left", "cursorleft" ],
		"short_name": "KC_MS_L"
	},
	"KC_MS_RIGHT": {
		"description": "Mouse Cursor Right",
		"keycode": "0xF3",
		"label": [ "mouse right", "mouseright", "cursor right", "cursorright" ],
		"short_name": "KC_MS_R"
	},
	"KC_MS_BTN1": {
		"description": "Mouse Button 1",
		"keycode": "0xF4",
		"label": [ "button1", "btn1" ],
		"short_name": "KC_BTN1"
	},
	"KC_MS_BTN2": {
		"description": "Mouse Button 2",
		"keycode": "0xF5",
		"label": [ "button2", "btn2" ],
		"short_name": "KC_BTN1"
	},
	"KC_MS_BTN3": {
		"description": "Mouse Button 3",
		"keycode": "0xF6",
		"label": [ "button3", "btn3" ],
		"short_name": "KC_BTN3"
	},
	"KC_MS_BTN4": {
		"description": "Mouse Button 4",
		"keycode": "0xF7",
		"label": [ "button4", "btn4" ],
		"short_name": "KC_BTN4"
	},
	"KC_MS_BTN5": {
		"description": "Mouse Button 5",
		"keycode": "0xF8",
		"label": [ "button5", "btn5" ],
		"short_name": "KC_BTN5"
	},
	/* Mousekey wheel */
	"KC_MS_WH_UP": {
		"description": "Mouse Wheel Up",
		"keycode": "0xF9",
		"label": [ "wheel up", "wheelup" ],
		"short_name": "KC_WH_U"
	},
	"KC_MS_WH_DOWN": {
		"description": "Mouse Wheel Down",
		"keycode": "0xFA",
		"label": [ "wheel down", "wheeldown" ],
		"short_name": "KC_WH_D"
	},
	"KC_MS_WH_LEFT": {
		"description": "Mouse Wheel Left",
		"keycode": "0xFB",
		"label": [ "wheel left", "wheelleft" ],
		"short_name": "KC_WH_L"
	},
	"KC_MS_WH_RIGHT": {
		"description": "Mouse Wheel Right",
		"keycode": "0xFC",
		"label": [ "wheel right", "wheelright" ],
		"short_name": "KC_WH_R"
	},
	/* Mousekey accel */
	"KC_MS_ACCEL0": {
		"description": "Mouse Acceleration 0",
		"keycode": "0xFD",
		"label": [ "accel0" ],
		"short_name": "KC_ACL0"
	},
	"KC_MS_ACCEL1": {
		"description": "Mouse Acceleration 1",
		"keycode": "0xFE",
		"label": [ "accel1" ],
		"short_name": "KC_ACL1"
	},
	"KC_MS_ACCEL2": {
		"description": "Mouse Acceleration 2",
		"keycode": "0xFF",
		"label": [ "accel2" ],
		"short_name": "KC_ACL2"
	}
};
