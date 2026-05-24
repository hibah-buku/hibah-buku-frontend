<script>
    import Icon from "@iconify/svelte";
    
    let { 
        icon = "heroicons:user", 
        title = "Aktivitas", 
        description = "Deskripsi aktivitas", 
        time = "Baru saja",
        color = "gray" 
    } = $props();

    const colors = {
        gray: 'bg-gray-100 text-gray-600',
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        yellow: 'bg-yellow-100 text-yellow-600',
        red: 'bg-red-100 text-red-600'
    };
</script>

<div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div class={`p-2 rounded-full shrink-0 ${colors[color]}`}>
        <Icon {icon} class="w-8 h-8" />
    </div>
    <div class="flex-1 min-w-0">
        <p class="text-md font-medium text-gray-800 truncate">{title}</p>
        <p class="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
        <p class="text-sm text-gray-400 mt-1">{time}</p>
    </div>
</div>