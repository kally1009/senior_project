# ModHealth (Senior Project)

## Mockup/Storyboard
https://www.figma.com/file/kuSjl1UbBwiUXkxhBDq8kj/Mood-Tracker-Senior-Project-Web-App?type=design&mode=design&t=USLcERzqgkj4Cgbw-1

## Resources
###### Entries
Attributes:
- date (date MM-DD-YYYY)
- Mood (integer)
- journal (journalSchema)
- Activity Tag (list of strings)

###### Journal
Attributes:
- title (string)
- description (string)
- entry_id (Object Id)
#
Rest Endpoints
|Name | Method | Path |
|-----|--------|------|
| getEntries | GET | /entries |
| getJournal | GET | /entries/id
| createEntry | POST | /entries |
| createJournal | POST | /journals |
| saveEditEntries | PUT | /entries/id |
| saveEditJournal | PUT | /journals/id |
| deleteEntry | DELETE | /entries/id |
| deleteEntry | DELETE | /journals/id |

#
Additional Notes:
- Statistics Page(GET date(s),mood, activity tags from getEntries)
- Calendar Page (GET date and mood from getEntries)
- If time, want to add user accounts and authentication. 
