/// <reference path="../../../../../typings/globals/jquery/index.d.ts" />
import { capitalize, car } from "../utils/general";

export class CarDetailsTable {
    constructor(car) {
		this.car = car;
      	this.lang = $("html").attr("lang");
    }
    render() {
		let details = "";
		if (this.lang == "en" ? car.details : car[this.lang].details) {
			for (const detail of this.lang == "en" ? car.details : car[this.lang].details) {
				details += `
				<tr>
					<td class="title">${capitalize(detail.key)}</td>
					<td>${capitalize(detail.value)}</td>
				</tr>
				`;
			}
		}
        return `
        <table id="table">
			<tr>
				<td class="title" data-langKey="info-mark-title">Mark</td>
				<td>${this.car.mark}</td>
			</tr>
			<tr>
				<td class="title" data-langKey="info-model-title">Model</td>
				<td>${this.car.model}</td>
			</tr>
			<tr>
				<td class="title" data-langKey="info-color-title">Color</td>
				<td>${this.lang == "en" ? this.car.color : capitalize(this.car[this.lang].color)}</td>
			</tr>
			<tr>
				<td class="title" data-langKey="info-fuel-title">Fuel</td>
				<td>${this.lang == "en" ? this.car.fuel : capitalize(this.car[this.lang].fuel)}</td>
			</tr>
			<tr>
				<td class="title" data-langKey="info-transmission-title">Transmission</td>
				<td>${this.lang == "en" ? this.car.transmission : capitalize(this.car[this.lang].transmission)}</td>
			</tr>
			<tr>
				<td class="title" data-langKey="info-year-title">Year</td>
				<td>${this.car.year}</td>
			</tr>
			<tr>
				<td class="title" data-langKey="info-power-title">Power</td>
				<td>${this.car.power}kW</td>
			</tr>
			<tr>
				<td class="title" data-langKey="info-distance-title">Distance</td>
				<td>${this.car.distance}km</td>
			</tr>
			<tr>
				<td class="title" data-langKey="info-doors-title">Doors</td>
				<td>${this.car.doors}</td>
			</tr>
			<tr>
				<td class="title" data-langKey="info-seats-title">Seats</td>
				<td>${this.car.seats}</td>
			</tr>
            ${details}
		</table>
        `;
    }
}