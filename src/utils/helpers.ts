import { Index } from "../types/index";
import DOMPurify from "dompurify";

export const sortIndexes = (
  data: Index[],
  startUTC: number,
  endUTC: number,
  noOfPost: number,
  order: string
) => {


  if (data === undefined)
    return [];


  const sorted: Index[] = [];

  data.map((element) => {
    const utc = element["created_utc"];
    if (utc > startUTC) if (utc < endUTC) sorted.push(element);
  });

  if (sorted.length == 0) {
    // throw new Error("No entries found.");
    return [];
  }

  if (order == "hot") sorted.sort((a: Index, b: Index) => a.score - b.score);
  else sorted.sort((a: Index, b: Index) => b.created_utc - a.created_utc);

  const sliced = sorted.slice(0, noOfPost);

  const indexes = [];
  indexes.push(...sliced);

  return indexes;
};

export const makeHTMLFromString = (str: string) => {  const text = str;  let parsed = "<p>" + text + "</p>";  parsed = parsed.replace(/\r\n\r\n/g, "</p><p>").replace(/\n\n/g, "</p><p>");  parsed = parsed.replace(/\r\n/g, "<br />").replace(/\n/g, "<br />");  return DOMPurify.sanitize(parsed);};

export const convertDate = (dateInUTC: number) => {
  const event = new Date(dateInUTC * 1000);
  const displayTime = event.toDateString() + " " + event.toTimeString();
  return displayTime;
};

export const getCurrentDateInput = () => {
  const today = new Date();
  const numberOfDaysToAdd = 3;
  const date = today.setDate(today.getDate() + numberOfDaysToAdd); 
  const defaultValue = new Date(date).toISOString().split('T')[0] // yyyy-mm-dd

  return defaultValue;
};

export const normaliseDate = (creation_time: number) => {

  const date = new Date(creation_time * 1000);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return [date.getFullYear(), date.getMonth(), weekday[date.getDay()]];
}