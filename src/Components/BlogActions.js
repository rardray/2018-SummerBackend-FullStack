

 export function onDelete(id) {
        console.log(id)
        fetch('/client/posts/delete/' + id, {
            method: 'DELETE',
            body: JSON.stringify(id),
        })
            .then(res => res.json())
            .catch(err => err)
        
    }

    export function editPost(id, body) {
        fetch('/client/posts/edit/' + id, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
              }
        })
            .then(res => res.json())
            .then(()=> {this.props.history.push('/posts')})
            .catch(err => err)
    }
    export function findValue(array, nameWeAreLookingFor) {
        for(var i = 0; i<array.length; i++) {
            if(array[i]._id === nameWeAreLookingFor) return i;
        }
        return -1;
    }

    export function renderDate() {
        const d = new Date()
        const avp = (d)=> {
          if (d.getHours() < 12) {
            return 'a.m'
          } else {
            return 'p.m'
          }
        }
        const minutes = (d) => {
          if (d < 10) {
            return '0' + d
          } else {
            return d
          }
        }
        const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return `${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}, ${hours[d.getHours()]}:${minutes(d.getMinutes())} ${avp(d)}`
        }

    export function rawDate() {
        const d = new Date()
        const addDigit = (d) => {
            if(d < 10){
                return `0${d}`
            } else {
                return d
            }
        }
        return `${d.getFullYear()}${addDigit(d.getMonth())}${addDigit(d.getDate())}${addDigit(d.getHours())}${addDigit(d.getMinutes())}${addDigit(d.getSeconds())}`
    }