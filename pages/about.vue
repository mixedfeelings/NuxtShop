<template>
	<div>
		<Html>
			<Head>
				<Title>About | Issue Press</Title>
				<Meta
					name="description"
					content="Issue Press is a tiny publisher and Risograph print shop based in Grand Rapids, Michigan"
				/>
				<Meta property="og:title" content="About | Issue Press" />
				<Meta property="og:site_name" content="Issue Press" />
				<Meta property="og:type" content="article" />
				<Meta property="og:url" content="https://issue.press/about" />
				<Meta property="og:image" content="/issue-press.png" />
				<Meta name="twitter:card" content="summary" />
				<Meta name="twitter:site" content="@issuepress" />
			</Head>
		</Html>
		<section
			class="px-6 my-8 font-serif text-lg md:text-2xl lg:text-3xl md:leading-10 lg:leading-12"
		>
			<p>
				Issue Press is a tiny publisher and Risograph print shop operated by
				George Wietor in Grand Rapids, Michigan. Since 2011, it has worked with
				an elastic mandate to publish captivating works by artists of all
				mediums that trade in humor, history, and exploration of place.
			</p>
			<p>
				In addition to publishing, Wietor has initiated several side projects
				dedicated to the growth of the international Riso community, including:
				<a href="https://stencil.wiki">stencil.wiki</a>;
				<a href="https://stencil.wiki/atlas">An Atlas of Modern Risography</a>;
				and with Matt Davis of
				<a href="https://perfectly-acceptable.com">Perfectly Acceptable Press</a
				>, Wietor is a co-founder of the
				<a href="http://risograph.org"
					>North American Risograph Conference (NARC)</a
				>, a gathering of Riso devotees held biannually in Chicago, Illinois.
			</p>
		</section>
		<section class="bg-natural font-sans py-8">
			<div class="flex flex-col md:flex-row">
				<div class="w-full md:w-1/2 px-6 pb-4 md:pb-0">
					<img
						src="/images/issue-press_bergen-art-book-fair-2022.jpg"
						class="mb-1"
						alt="A somewhat meta photo of a polaroid of two people standing between a table full of books and wall covered in prints at an art book fair"
					/>
					<div class="text-center font-mono text-xs px-6">
						George of Issue Press with Jessica Williams at the launch of
						<em
							><NuxtLink class="underline" to="/item/oslofjord"
								>Oslofjord</NuxtLink
							></em
						>
						at Bergen Art Book Fair 2022. Photo by
						<a
							href="https://anki.biz"
							class="underline"
							target="_blank"
							style="white-space: nowrap"
							>Ann-Kristin Stølan</a
						>
					</div>
				</div>
				<div class="w-full md:w-1/2 lg:w-full flex flex-col lg:flex-row px-6">
					<div class="flex flex-col items-center md:items-start h-full">
						<div
							class="text-base md:text-lg lg:text-2xl text-center md:text-left md:pr-6"
						>
							<h3 class="font-semibold font-serif">Issue Press</h3>
							P.O. Box 68751<br />
							Grand Rapids, MI 49516<br />
							US <em>of</em> A<br />
							<br />
							info@issue.press<br />
							<br />
							<em>Studio visits by appointment only.</em>
						</div>
					</div>
					<div class="lg:pl-6">
						<!-- Begin MailChimp Signup Form -->
						<div
							id="mc_embed_signup"
							class="w-full text-center md:text-left mt-6 lg:mt-0"
						>
							<form
								action="https://issue-press.us2.list-manage.com/subscribe/post?u=4804e7056fcf0c786d917a302&amp;id=a733fd0da9"
								method="post"
								id="mc-embedded-subscribe-form"
								name="mc-embedded-subscribe-form"
								class="validate w-full"
								target="_blank"
							>
								<h3 class="font-serif text-base md:text-lg lg:text-xl">
									Mailing List
								</h3>
								<p>Infrequent, but fun maybe!</p>
								<div
									class="flex gap-1 justify-center md:justify-start items-center"
								>
									<div class="mc-field-group">
										<input
											type="email"
											value="Email address"
											onclick="this.value='';"
											onfocus="this.select()"
											onblur="this.value=!this.value?'Email address':this.value;"
											name="EMAIL"
											class="required email p-4 border border-black border-2"
											id="mce-EMAIL"
										/>
									</div>
									<div id="mce-responses" class="clear">
										<div
											class="response"
											id="mce-error-response"
											style="display: none"
										></div>
										<div
											class="response"
											id="mce-success-response"
											style="display: none"
										></div>
									</div>
									<input
										type="submit"
										value="Go"
										name="subscribe"
										id="mc-embedded-subscribe"
										class="button px-6 py-4 text-white bg-black cursor-pointer font-serif"
									/>
								</div>
							</form>
						</div>
						<!--End mc_embed_signup-->
						<SocialMedia large class="pt-8 justify-center md:justify-start" />
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script lang="ts" setup>
import { useColorStore } from "~/stores/colors";

const colorStore = useColorStore();

onMounted(() => {
	colorStore.setGlobalColor();
	document.documentElement.style.setProperty(
		"--global-color",
		`var(--color-${colorStore.globalColor})`
	);
	document.documentElement.style.setProperty(
		"--global-text-color",
		`var(--color-${colorStore.globalTextColor})`
	);
});
</script>
