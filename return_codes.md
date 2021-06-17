# Return codes

## Cache.add()

| Code Number | Details                      | Included `data` field? | Is Error? |
|-------------|---------------------------- -|------------------------|-----------|
| -4          | Missing key and value.       | No.                    | **Yes**   |
| -3          | Missing value.               | Yes. `key`.            | **Yes**   |
| -2          | Missing key.                 | Yes. `value`.          | **Yes**   |
| -1          | Key matches a group name.    | Yes. All data          | **Yes**   |
| 0           | No changes to existing data. | No.                    | No        |
| 1           | Overwrote existing data.     | Yes. Old data          | No        |
