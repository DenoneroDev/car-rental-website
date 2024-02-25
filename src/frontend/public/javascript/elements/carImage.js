/// <reference path="../../../../../typings/globals/jquery/index.d.ts" />

export class CarImage {
    constructor(image, index, justImage = false) {
        this.image = image;
        this.index = index;
        this.justImage = justImage;
    }
    render() { 
        if (this.justImage)
			return `
				<img
				src="${this.image}"
				data-index="${this.index}"
				alt="car" />`
        return `
            <div
				class="swiper-slide"
				style="
					display: flex;
					align-items: center;
					justify-content: center;
				">
				<img
					id="image"
					src="${this.image}"
					data-index="${this.index}"
					alt="car" />
			</div>
        `;
    }
}