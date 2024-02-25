/// <reference path="../../../../../typings/globals/jquery/index.d.ts" />

export class Packet {
    constructor(packet) {
        this.packet = packet;
        this.lang = $("html").attr("lang");
    }
    render() {
        let features = "";
        for (const feature of this.lang == "en" ? this.packet.features : this.packet[this.lang].features) {
            features += `
            <li>
                <div id="feature-content">
                    <div class="icon">
                        <img src="/images/best-price.png" />
                    </div>
                    <span>${feature}</span>
                </div>
            </li>
            `;
        }
        return `
           <article class="plan card ${(this.packet.vip) ? "vip" : ""}">
				<div class="inner">
					<span class="pricing">
						<span>
							${this.packet.price}€ /<small
								>${this.packet.from} ${(this.packet.to) ? " - " + this.packet.to : ""}
								<span data-langKey="packet-days">day(s)</span></small
							>
						</span>
					</span>
                    <!--<p class="extra">Extra days: ${this.packet.extra}€ /<small>
								<span data-langKey="packet-days">day(s)</span></small>
                    </p>--!>
					<p class="info">
						${this.lang == "en" ? this.packet.description : this.packet[this.lang].description}
					</p>
					<ul class="features">
                        ${features}
					</ul>
				</div>
			</article>
        `;
    }
}