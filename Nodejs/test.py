import json
your_json = '[{"fullName": "Nguyen Vi Khang", "Age": 19, "School": "FPT Greenwich"}, {"fullName": "Nguyen Vi An", "Age": 14, "School": "Pham Van Chieu"}]'
parsed = json.loads(your_json)
print(json.dumps(parsed, indent=4, sort_keys=True))