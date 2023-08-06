export default function formatDate(inputDate) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const parts = inputDate.split(",");
  const dateParts = parts[0].split("/");
  const monthIndex = parseInt(dateParts[0]) - 1;
  const day = dateParts[1];
  const year = parseInt(dateParts[2]);
  const timeParts = parts[1].split(" ");
  const time =
    timeParts[1].split(":")[0] +
    ":" +
    timeParts[1].split(":")[1] +
    " " +
    timeParts[2];

  const formattedDate = `${months[monthIndex]} ${day}, ${year} ${time}`;
  return formattedDate;
}
