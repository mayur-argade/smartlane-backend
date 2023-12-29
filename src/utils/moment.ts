import * as moment from 'moment';

function format_Date() {
    const myDate = moment();
    const newDate = myDate.add(10, 'minutes');
    const formattedDate = newDate.format('YYYY-MM-DD HH:mm:ss');
    return formattedDate
}
let result = format_Date();
export default format_Date;
