/// <reference path="../../../../../typings/globals/jquery/index.d.ts" />

export class Rating {
    constructor(rating) {
        this.rating = rating;
        this.lang = $("html").attr("lang");
    }
    render() {
        let stars = "";
        for (let i = 0; i < this.rating.stars; i++) {
            stars += `<img src="/images/star.png" class="selected" />`
        }
        for (let i = 0; i < 5 - this.rating.stars; i++) {
            stars += `<img src="/images/star.png" />`
        }
        return `
			<div class="website-rating swiper-slide">
				<p id="name">${this.rating.name}</p>
				<p id="comment">${(this.lang == "en") ? this.rating.comment : this.rating[this.lang].comment}</p>
				<div class="stars" id="website-ratings-stars">
                    ${stars}
				</div>
			</div>
        `;
    }
}