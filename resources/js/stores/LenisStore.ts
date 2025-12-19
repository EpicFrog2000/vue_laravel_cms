import Lenis from 'lenis';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLenis = defineStore('lenis', () => {
    let lenis: Lenis;
    const scrollPercent = ref(0);
    function init(callback: (scroll: number, percent: number) => void) {
        lenis = new Lenis({
            lerp: 0.07,
        });
        function raf(time: number) {
            lenis!.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        lenis.on('scroll', ({ scroll }) => {
            const percent =
                (scroll / (document.body.scrollHeight - window.innerHeight)) *
                100;
            scrollPercent.value = percent;
            callback(scroll, percent);
        });
    }
    function getLenis() {
        return lenis;
    }
    function scrollTo(target: string | number | HTMLElement){
        lenis.scrollTo(target);
    }
    return { init, getLenis, scrollTo };
});
