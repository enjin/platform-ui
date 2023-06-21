<template>
    <div class="grid min-h-full place-items-center bg-white px-4 py-12 lg:px-8">
        <div class="text-center">
            <p class="text-base font-semibold text-primary">404</p>
            <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
            <p class="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn't find the page you're looking for.</p>
            <div class="mt-10 flex items-center justify-center gap-x-6">
                <RouterLink :to="{ name: 'platform.collections' }">
                    <button
                        class="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                        Go back home
                    </button>
                </RouterLink>
            </div>
        </div>
    </div>
</template>
