class Flight {
    constructor(data) {
        this.origin = data.originLocationCode;
        this.destination = data.destinationLocationCode;
        this.departureDate = data.departureDate;
        this.returnDate = data.returnDate;
        this.adults = data.adults;
    }
}

module.exports = Flight;
