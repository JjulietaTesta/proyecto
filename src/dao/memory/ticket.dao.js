export default class TicketMemoryDao {
    constructor(){
        this.ticket = []
    }

    async getTickets(){
        return this.tickets
    }

    async getTicketsById(tid){
        return this.tickets.fin(tickets=>this.ticket._id === tid)
    }


    async saveTicket(ticket){
        this.tickets.push(ticket)
        this.tickets.forEach(ticket =>{
            ticket._id= this.tickets.indexOf(ticket)+1
        })
        return ticket
    }
}