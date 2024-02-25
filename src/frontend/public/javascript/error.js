/// <reference path="../../../../typings/globals/jquery/index.d.ts" />
const $status = $("#status");
const $msg = $("#msg");
const statusCode = $status.text();
import "../css/error.css";
import "../css/responsive.css";

const MSGS = {
    500: "Oops, we have an internal server error. Sorry for that.",
    404: "Mhhhhmm, we can't find that page. Sorry.",
}
$(document).ready(async () => {
    $msg.text(MSGS[statusCode]);
});