// const validJson = (json) => {
//   try {
//     JSON.parse(json);
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

// console.log(validJson('{"valid":true}'));

// console.log(
//   validJson({
//     name: "Rahmat",
//     age: 25,
//     isStudent: false,
//     skills: ["JavaScript", "React", "Next.js"],
//   })
// );

// const url = new URL(
//   "https://example.com/api/v1/products?category=laptop&sort=price_desc&page=2&limit=20"
// );

// console.log(url.searchParams.get("price"));

// const formatNumber = new Intl.NumberFormat("en", {
//   notation: "compact",
//   maximumFractionDigits: 1,
// });

// console.log(formatNumber.format(1234555));
// console.log(formatNumber.format(46243565334555));
// console.log(formatNumber.format(34644555));
// console.log(formatNumber.format(1000));

// const date = new Date();
//
// const dateFormatter = new Intl.DateTimeFormat("en", {
//   hour: "2-digit",
//   minute: "2-digit",
//   second: "2-digit",
// });
//
// console.log(dateFormatter.format(date));

const date = new Date();
const dateFormatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
});
console.log(dateFormatter.format(-date, "minutes"));
