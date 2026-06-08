<script>
    import Icon from "@iconify/svelte";

    let {
        title = "Judul",
        value = "0",
        icon = "",
        color = "blue"
    } = $props();

    const colors = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-700', iconBg: 'bg-blue-100', iconText: 'text-blue-600', border: 'border-blue-500', titleText: 'text-blue-900' },
        green: { bg: 'bg-green-50', text: 'text-green-700', iconBg: 'bg-green-100', iconText: 'text-green-600', border: 'border-green-500', titleText: 'text-green-900' },
        yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', iconBg: 'bg-yellow-100', iconText: 'text-yellow-600', border: 'border-yellow-500', titleText: 'text-yellow-900' },
        cyan: { bg: 'bg-cyan-50', text: 'text-cyan-700', iconBg: 'bg-cyan-100', iconText: 'text-cyan-600', border: 'border-cyan-500', titleText: 'text-cyan-900' },
        rose: { bg: 'bg-rose-50', text: 'text-rose-700', iconBg: 'bg-rose-100', iconText: 'text-rose-600', border: 'border-rose-500', titleText: 'text-rose-900' },
    }

    const style = colors[color] || colors.blue;
</script>

<div class={`${style.bg} p-3 rounded-lg shadow-sm border-2 ${style.border} hover:shadow-lg transition-shadow`}>

    
    <!-- Ikon dengan Background Warna -->
    <div class={`flex justify-between items-center p-3 rounded-lg ${style.iconBg}`}>
        <div class="shrink-0 flex items-center justify-center">
            <Icon {icon} class={`w-12 h-12 ${style.iconText}`} />
        </div>
        <div class="flex flex-col min-w-0 justify-center">
            <p class={`text-sm font-medium mb-1 ${style.titleText} truncate`}>{title}</p>
            <h3 class={`text-3xl pr-6 text-end font-bold ${style.text} tracking-tight`}>{value}</h3>
        </div>
    </div>
</div>