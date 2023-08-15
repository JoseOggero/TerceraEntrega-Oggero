const Ticket = require('../models/Ticket');

class TicketRepository {
  static async createTicket(purchaser, amount, products) {
    const code = generateUniqueCode();
    const purchaseDatetime = new Date();
    
    const ticket = new Ticket({
      code,
      purchase_datetime: purchaseDatetime,
      amount,
      purchaser,
      products,
    });

    await ticket.save();
    return ticket;
  }
}

module.exports = TicketRepository;
