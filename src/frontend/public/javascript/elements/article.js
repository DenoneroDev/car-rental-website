/// <reference path="../../../../../typings/globals/jquery/index.d.ts" />
import { capitalize, convertDate } from "../utils/general";
export class Article {
    constructor(car) {
      this.car = car;
      this.lang = $("html").attr("lang");
    }
  render() {
    let keywords = "";
        for(const keyword of ((this.lang == "en") ? this.car.keywords : this.car[this.lang]?.keywords) || []) {
            keywords += `<p class="popular-car-keyword" title="${capitalize(keyword)}">${capitalize(keyword)}</p>
                        <div class="popular-car-keyword-line"></div>`
        }

    return `
              <a href="/car?id=${this.car._id}">
                <article class="popular-car">
                  <img class="popular-car-image" src="${this.car.image}">
                  <div class="popular-car-content">
                    <div>
                      <p class="popular-car-title">${(this.lang == "en") ? this.car.title : this.car[this.lang].title}</p>
                      <div class="rating">
                        <img src="/images/star.png">
                        <p class="rate">${this.car.rating} / 5</p>
                        <p class="rates">(${this.car.ratings})</p>
                      </div>
                      <div class="popular-car-keywords">
                      ${keywords}
                      </div>
                    </div>
                    <p class="popular-car-description">
                      ${((this.lang == "en") ? this.car.description : this.car[this.lang]?.description)?.replace(/<[^>]+>/g, '')}
                    </p>
                    <div id="bottom">
                      <p id="info">
                      ${this.car.rentedUntil ? `<img src="/images/info.png" />
                        ${convertDate(this.car.rentedUntil)}` : ""}
                      </p>
                      <button class="popular-car-button" data-langKey="car-button">Rent this car</button>
                    </div>
                  </div>
                </article>
                </a>
        `;
    }
}