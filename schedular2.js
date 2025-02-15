//Keeping data from invoice.json file which have status of "pending" and archiving the records with status "paid" to the archive.json

import cron from "node-cron";
import * as fs from "node:fs";
import path from "path";

import { readFile } from "fs/promises";

const invoices = JSON.parse(
  await readFile(new URL("./data/invoice.json", import.meta.url))
);

const archiveInvoicesTask = () => {
  console.log("Running invoices task at: ", new Date());
  try {
    //created new array  "paidInvoices" with invoices only with status = "paid"
    const paidInvoices = invoices.filter((item) => {
      return item.status === "paid";
    });

    //removed all invoices with status "paid" from original "invoices" array
    if (paidInvoices.length > 0) {
      paidInvoices.forEach((item) => {
        invoices.splice(
          invoices.findIndex((e) => e.status === item.status),
          1
        );
      });
      console.log("Invoices:");
      console.log(invoices);
      console.log("Paid Invoices:");
      console.log(paidInvoices);
    }

    //writing the updated "invoices" into our file "invoice.json"
    fs.writeFileSync(
      path.join("./", "data", "invoice.json"),
      JSON.stringify(invoices),
      "utf-8"
    );

    //reading and appending archive.json
    var previousPaidInvoices = fs.readFileSync(
      path.join("./", "data", "archive.json"),
      "utf-8"
    );
    //if data exists in archive.json
    if (previousPaidInvoices.trim()) {
      previousPaidInvoices = JSON.parse(previousPaidInvoices);
      console.log("Previous paid invoices: ");
      console.log(previousPaidInvoices);
    }
    //if data exists in "paidInvoices"
    if (paidInvoices.length > 0) {
      previousPaidInvoices = [...previousPaidInvoices, ...paidInvoices];
      console.log("After adding Paid invoices to Previous paid invoices: ");
      console.log(previousPaidInvoices);
    }

    //writing the "paidInvoices into our file "archive.json"
    fs.writeFileSync(
      path.join("./", "data", "archive.json"),
      JSON.stringify(previousPaidInvoices),
      "utf-8"
    );
  } catch (error) {
    console.log("error: ", error);
  }
  console.log("Archive Task has ended!");
};

cron.schedule("*/10 * * * * *", archiveInvoicesTask);
