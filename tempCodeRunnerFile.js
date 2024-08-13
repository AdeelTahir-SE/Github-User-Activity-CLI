.data.map(event=>{
//   switch(event.type){
//     case "PushEvent":
//       return `- Pushed ${event.payload.commits.length} commits to ${event.repo.name}`;
//     case "IssuesEvent":
//       return `- Opened a new issue in ${event.repo.name}`;
//     case "WatchEvent":
//       return `- Starred ${event.repo.name}`;

//     default:{
//       return event.type;
//     }
//   }
// }).filter(Boolean);