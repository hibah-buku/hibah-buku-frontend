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
    };

    const style = $derived(colors[color] || colors.blue);
    const isNumber = $derived(!isNaN(Number(value)) && String(value).trim() !== '');
</script>

<div class={`${style.bg} p-3 rounded-lg shadow-sm border-2 ${style.border} hover:shadow-lg transition-shadow duration-200`}>
    <div class={`flex justify-between items-center p-3 rounded-lg ${style.iconBg}`}>
        <div class="shrink-0 flex items-center justify-center mr-3">
            <Icon {icon} class={`w-12 h-12 ${style.iconText}`} />
        </div>
        <div class="flex flex-col min-w-0 justify-center flex-1 text-right">
            <p class={`text-xs font-semibold mb-1 ${style.titleText} truncate`}>{title}</p>
            {#if isNumber}
                <h3 class={`text-3xl font-bold ${style.text} tracking-tight truncate`}>{value}</h3>
            {:else}
                <h3 class={`text-sm md:text-base font-bold ${style.text} tracking-tight truncate`} title={value}>
                    {value}
                </h3>
            {/if}
        </div>
    </div>
</div>
