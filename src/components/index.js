import { ref } from 'vue'

export const sort = (field, sortMap, items) => {
    Object.keys(sortMap).filter(f => f != field && sortMap[f].sign != null).forEach(e => sortMap[e].sign = null)
    sortMap[field].sign = !sortMap[field].sign

    items.sort(sortBy(field, sortMap))
}

export const sortBy = (field, sortMap) => {

    const reverse = sortMap[field].sign ? 1 : -1
    const primer = sortMap[field].primer

    const key = primer ? (e) => primer(sortMap[field].nested ? sortMap[field].nested(e) : e[field]) : (e) => sortMap[field].nested ? sortMap[field].nested(e) : e[field];

    return (a, b) => {
        return a = key(a), b = key(b), reverse * ((b == null ? true : a > b) - (a == null ? true : b > a));
    }
}


export const getSortIcon = sign => sign == null ? "mdi-sort" : sign ?  "mdi-sort-descending" : "mdi-sort-ascending"