import { Transition } from '@headlessui/react'

const SplashLoading = (props: { show: boolean }) => {
    return (
        <Transition
            className="absolute"
            show={props.show}
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="h-screen w-screen items-center justify-center flex">
                <span className="text-5xl text-white font-extrabold animate-ping">
                    ...
                </span>
            </div>
        </Transition>
    )
}

export default SplashLoading