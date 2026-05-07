import json
import logging
import re

logger = logging.getLogger(__name__)

def extract_text(data, key="answer"):
    """
    Robustly extracts text from a potentially nested and stringified JSON structure.
    Tries multiple common keys and handles double-stringified JSON.
    """
    # 1. Handle non-dict data (base case or double-stringified JSON)
    if not isinstance(data, dict):
        if isinstance(data, str):
            stripped = data.strip()
            if stripped.startswith('{'):
                try:
                    return extract_text(json.loads(stripped), key)
                except Exception:
                    # Regex fallback for broken JSON (common with Llama 3.1 8B unescaped quotes)
                    # Look for "answer": "..." or "answer": '...'
                    pattern = f'"{key}"\\s*:\\s*"(.*?)"(?=\\s*[,}}])'
                    match = re.search(pattern, stripped, re.DOTALL)
                    if match:
                        content = match.group(1)
                        # Basic unescaping for newlines and quotes
                        return content.replace('\\n', '\n').replace('\\"', '"').replace("\\'", "'")
                    
                    # If specific key not found, try any string value
                    any_str_pattern = r'":\s*"(.*?)"(?=\s*[,}])'
                    matches = re.findall(any_str_pattern, stripped, re.DOTALL)
                    if matches:
                        return max(matches, key=len).replace('\\n', '\n').replace('\\"', '"')

                    return stripped
        return str(data)

    # 2. Try the preferred key
    val = data.get(key)
    
    # 3. If key not found, try common fallbacks
    if val is None:
        fallbacks = ["answer", "response", "content", "text", "cover_letter", "output"]
        for f_key in fallbacks:
            if f_key in data:
                val = data[f_key]
                break
    
    # 4. If still None, try to find the longest string value in the dict (heuristic)
    if val is None:
        strings = [v for v in data.values() if isinstance(v, str)]
        if strings:
            val = max(strings, key=len)
        else:
            # Last resort: return the whole dict as string
            return str(data)

    # 5. Recursive call to handle nested structures or stringified JSON values
    if isinstance(val, (dict, str)):
        # If the value is exactly what we were looking for but it's another dict/stringified JSON, 
        # keep digging but stop if we are just returning the same thing
        result = extract_text(val, key)
        if result == str(val) and isinstance(val, str):
            return val
        return result
        
    return str(val)
