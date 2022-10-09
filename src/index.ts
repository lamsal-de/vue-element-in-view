import { Plugin } from "vue"

export type IntersectionOptions = {
    callback: () => void
    once: boolean
}

const observerToThreshold = new Map<number, IntersectionObserver>()
const elementToOptions = new WeakMap<Element, IntersectionOptions>()

function getOrCreateObserver(threshold: number): IntersectionObserver {
    if (observerToThreshold.has(threshold)) {
        return observerToThreshold.get(threshold)!
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(({ target, isIntersecting }) => {
                if (isIntersecting) {
                    const options = elementToOptions.get(target)

                    if (!options) {
                        return observer.unobserve(target)
                    }

                    options.callback()
                    if (options.once) {
                        observer.unobserve(target)
                        elementToOptions.delete(target)
                    }
                }
            })
        },
        { threshold }
    )
    return observer
}

function getThreshold(defaultThreshold: number, argumentThreshold?: string) {
    let threshold = defaultThreshold
    if (argumentThreshold) {
        const parsedThreshold = Number.parseInt(argumentThreshold)
        if (isNaN(parsedThreshold)) {
            console.warn(
                `Supplied threshold '${argumentThreshold}' is not a number. Falling back to default threshold ${defaultThreshold}.`
            )
        } else if (parsedThreshold < 0 || parsedThreshold > 100) {
            console.warn(
                `Supplied threshold '${argumentThreshold}' is out of bounds [0, 100]. Fallback to default threshold ${defaultThreshold}.`
            )
        } else {
            threshold = parsedThreshold
        }
    }
    return threshold / 100
}

export const elementInView: Plugin = {
    install(app, { threshold: defaultThreshold, ssr }) {
        if (ssr) {
            app.directive("element-in-view", {
                getSSRProps: () => ({}),
            })
            return
        }

        app.directive("element-in-view", {
            beforeMount(el, binding) {
                const threshold = getThreshold(defaultThreshold, binding.arg)
                const observer = getOrCreateObserver(threshold)
                observer.observe(el)
                const options: IntersectionOptions = {
                    callback: binding.value,
                    once: Boolean(binding.modifiers.once),
                }
                elementToOptions.set(el, options)
            },
        })
    },
}

export default elementInView
