export class MyDate extends Date {

    static MONTH = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    static DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    static DIFF = {
        second:     (date, e = 1) => date.setTime(date.getTime() + e * 1000),
        minute:     (date, e = 1) => date.setTime(date.getTime() + e * 60 * 1000),
        hour:       (date, e = 1) => date.setTime(date.getTime() + e * 60 * 60 * 1000),
        day:        (date, e = 1) => date.setTime(date.getTime() + e * 24 * 60 * 60 * 1000),
        month:      (date, e = 1) => date.setMonth  (date.getMonth() + e),
        year:       (date, e = 1) => date.setFullYear(date.getFullYear() + e)
    }

    static firstDayOfMonth = (date = new MyDate()) => new MyDate(date.getFullYear(), date.getMonth(), 1)
    static lastDayOfMonth = (date = new MyDate()) => new MyDate(date.getFullYear(), date.getMonth() + 1, 0)

    firstDayOfMonth() { return MyDate.firstDayOfMonth(this) }

    lastDayOfMonth() { return MyDate.lastDayOfMonth(this) }

    add(key, value) {
        if (typeof key === 'object' && key !== null) {
            Object.keys(key)
                .forEach(k => {
                    const diffKey = Object.keys(MyDate.DIFF).find(f => new RegExp('^' + k, 'i').test(f))
                    if (diffKey)
                        this.setTime(MyDate.DIFF[diffKey](this, Number(key[k])))
                })
        } else {
            const diffKey = Object.keys(MyDate.DIFF).find(f => new RegExp('^' + key, 'i').test(f))
            // console.log(diffKey, this)
            if (diffKey)
                this.setTime(MyDate.DIFF[diffKey](this, Number(value)))
        }
        return this
    }

    getDay() {
        return (n => n == 0 ? 6 : n - 1)(super.getDay())
    }

    extractDate() {
        this.setHours(0)
        this.setMinutes(0)
        this.setSeconds(0)
        this.setMilliseconds(0)
        return this
    }

    format(tpl) {
        return tpl
            .replace(/YYYY/i, this.getFullYear())
            .replace(/YY/i, ('0' + this.getFullYear()).slice(-2))
            .replace(/MMMM/i, MyDate.MONTH[this.getMonth])
            .replace(/MM/i, ('0' + (this.getMonth() + 1)).slice(-2))
            .replace(/M/i, this.getMonth() + 1)
            .replace(/DDDD/i, MyDate.DAYS[this.getDay()])
            .replace(/DD/i, ('0' + this.getDate()).slice(-2))
            .replace(/D/i, this.getDate())
    }

    static parse = (value, tpl) => {
        const regexp = tpl
            .replace(/\w+/g, (...e) => `(?<${ e[0] }>\\w{${ e[0].length }})`)

        const matches = value.match(new RegExp(regexp))
        return new MyDate(Date.parse(matches.groups.yyyy + '-' + matches.groups.MM + '-' + matches.groups.dd))
    }

}