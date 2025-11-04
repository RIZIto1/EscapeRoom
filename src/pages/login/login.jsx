import './login.css';


tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#36e27b",
                "background-light": "#f6f8f7",
                "background-dark": "#112117",
            },
            fontFamily: {
                "display": ["Spline Sans", "sans-serif"]
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
        },
    },
}


export default function Login() {

    return (
        <div class="font-display">
            <div class="relative flex h-auto min-h-screen w-full flex-col bg-gradient-to-br from-black via-[#0a140e] to-[#112117] group/design-root overflow-x-hidden">
                <div class="layout-container flex h-full grow flex-col">
                    <div class="px-4 flex flex-1 justify-center py-5">
                        <div class="layout-content-container flex flex-col max-w-md w-full flex-1">
                            <div class="flex flex-col items-center justify-center pt-8 pb-6">
                                <div class="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
                                    <span class="material-symbols-outlined text-primary text-4xl">key</span>
                                </div>
                                <h1 class="text-white tracking-tight text-[32px] font-bold leading-tight text-center">Iniciar Sesión</h1>
                            </div>
                            <div class="flex flex-col gap-4 px-4 py-3">
                                <label class="flex flex-col w-full flex-1">
                                    <p class="text-white text-base font-medium leading-normal pb-2">Usuario o Correo Electrónico</p>
                                    <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-[#29382f] h-14 placeholder:text-[#9eb7a8] p-4 text-base font-normal leading-normal" placeholder="Introduce tu usuario o correo electrónico" value="" />
                                </label>
                                <label class="flex flex-col w-full flex-1">
                                    <p class="text-white text-base font-medium leading-normal pb-2">Contraseña</p>
                                    <div class="flex w-full flex-1 items-stretch rounded-lg focus-within:ring-2 focus-within:ring-primary">
                                        <input class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#29382f] h-14 placeholder:text-[#9eb7a8] p-4 text-base font-normal leading-normal" placeholder="Introduce tu contraseña" type="password" value="" />
                                        <div class="text-[#9eb7a8] flex border-none bg-[#29382f] items-center justify-center pr-4 rounded-r-lg cursor-pointer">
                                            <span class="material-symbols-outlined">visibility</span>
                                        </div>
                                    </div>
                                </label>
                                <p class="text-[#9eb7a8] text-sm font-normal leading-normal text-right underline cursor-pointer hover:text-primary transition-colors" href='#'>¿Olvidaste tu contraseña?</p>
                            </div>
                            <div class="flex flex-col gap-4 px-4 py-3 mt-4">
                                <button class="flex items-center justify-center font-bold text-background-dark bg-primary h-14 w-full rounded-lg text-lg hover:bg-opacity-90 transition-opacity">
                                    Iniciar Sesión
                                </button>
                            </div>
                            <div class="flex flex-col items-center justify-center pt-6 pb-8">
                                <p class="text-[#9eb7a8] text-center text-base">
                                    ¿No tienes una cuenta? <a class="font-bold text-primary underline hover:text-opacity-80 transition-opacity" href="#">Regístrate</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}