<script>
	import { page } from '$app/stores';
	import Icon from '@iconify/svelte';
	import StatCard from './StatCard.svelte';
	import QuickActionPanel from './QuickActionPanel.svelte';

	let { dashboardData, error } = $props();

	let user = $derived($page.data.user || { name: 'Penulis Hibah' });

	// Hitung deadline terdekat format tanggal
	let formattedDeadline = $derived.by(() => {
		if (!dashboardData?.manuscript) return 'Lengkap';
		const manuscript = dashboardData.manuscript;
		const dateStr = manuscript.current_status?.code === 'revision_needed' 
			? manuscript.deadlines?.revision 
			: manuscript.deadlines?.draft;
		
		if (!dateStr) return 'Lengkap';
		return new Date(dateStr).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		});
	});
</script>

<div class="space-y-6">
	<!-- Welcome Card (Premium Design with Gradient) -->
	<div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-8 text-white shadow-xl">
		<div class="absolute right-0 top-0 translate-x-10 -translate-y-10 opacity-10">
			<Icon icon="heroicons:book-open" class="h-96 w-96" />
		</div>
		<div class="relative z-10 space-y-2">
			<span class="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-200 backdrop-blur-md">
				<span class="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
				Akun Aktif
			</span>
			<h2 class="text-3xl font-extrabold tracking-tight">Selamat Datang, {user.name}! 👋</h2>
			<p class="max-w-2xl text-blue-100 text-sm md:text-base leading-relaxed">
				Selamat datang di portal khusus Penulis Hibah Buku AEP. Pantau proses penilaian naskah Anda,
				perbaiki sesuai catatan reviewer, dan lengkapi berkas kontrak hibah dengan mudah di sini.
			</p>
		</div>
	</div>

	<!-- Error Alert -->
	{#if error}
		<div class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 flex gap-3 shadow-sm">
			<Icon icon="heroicons:exclamation-triangle" class="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
			<div class="text-sm font-semibold">{error}</div>
		</div>
	{/if}

	{#if !dashboardData || !dashboardData.has_manuscript}
		<!-- Empty State -->
		<div class="rounded-2xl border border-gray-200 bg-white p-12 text-center flex flex-col items-center justify-center space-y-5 shadow-sm">
			<div class="h-20 w-20 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
				<Icon icon="material-symbols:library-books-outline" class="h-10 w-10" />
			</div>
			<div class="space-y-2 max-w-lg">
				<h3 class="text-xl font-bold text-gray-800">Belum Ada Usulan Naskah Aktif</h3>
				<p class="text-sm text-gray-500 leading-relaxed">
					Anda sudah terdaftar sebagai Penulis! Namun, saat ini Anda belum mengunggah berkas naskah (*draft*) 
					buku pertama Anda untuk ditinjau oleh reviewer ahli.
				</p>
			</div>
			<a 
				href="/author/upload-draft"
				class="inline-flex items-center gap-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 text-sm font-semibold shadow-md transition-all duration-200 scale-100 hover:scale-105 cursor-pointer"
			>
				<Icon icon="material-symbols:upload-file-outline" class="h-5 w-5" />
				Unggah Draft Naskah Pertama
			</a>
		</div>
	{:else}
		<!-- Grid Statistik (Identik dengan StatCard Admin) -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<!-- Kartu 1: Draft Naskah Aktif (Blue Color Theme) -->
			<StatCard 
				title="Draft Naskah Aktif" 
				value={dashboardData.manuscript.title} 
				icon="clarity:contract-line" 
				color="blue" 
			/>

			<!-- Kartu 2: Status Penilaian (Dynamic Status Theme) -->
			<StatCard 
				title="Status Penilaian" 
				value={dashboardData.manuscript.current_status.label} 
				icon="heroicons:clipboard-document-check" 
				color={dashboardData.manuscript.current_status.code === 'approved' || 
					   dashboardData.manuscript.current_status.code === 'published' || 
					   dashboardData.manuscript.current_status.code === 'to_print' 
						   ? 'green' 
						   : (dashboardData.manuscript.current_status.code === 'revision_needed' || 
							  dashboardData.manuscript.current_status.code === 'publisher_revised' 
								  ? 'rose' 
								  : 'yellow')} 
			/>

			<!-- Kartu 3: Jenis Buku (Cyan Color Theme) -->
			<StatCard 
				title="Jenis Buku" 
				value={dashboardData.manuscript.book_type === 'bukuajar' ? 'Buku Ajar' : 'Buku Referensi'} 
				icon="heroicons:document-text" 
				color="cyan" 
			/>

			<!-- Kartu 4: Batas Waktu / Deadline (Rose Color Theme) -->
			<StatCard 
				title="Batas Waktu (Deadline)" 
				value={formattedDeadline} 
				icon="heroicons:clock" 
				color="rose" 
			/>
		</div>

		<!-- Layout Dua Kolom: Timeline & Aksi Cepat + Panduan -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Kolom Kiri: Alur Prosedur Hibah (Lebar 2/3) -->
			<div class="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
				<div class="border-b border-gray-100 pb-4">
					<h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
						<Icon icon="lucide:git-pull-request" class="h-5 w-5 text-blue-600" />
						Alur Prosedur Hibah Buku Anda
					</h3>
					<p class="text-xs text-gray-500 mt-0.5">Urutan tahapan administrasi naskah Anda yang bersumber dari API backend.</p>
				</div>

				<div class="relative pl-6 space-y-6 border-l-2 border-gray-100">
					{#each dashboardData.timeline as step (step.order)}
						<div class="relative">
							<!-- Circle Indicator -->
							<span class={`
								absolute -left-[31px] top-1 h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center bg-white transition-colors duration-200
								${step.state === 'completed' ? 'border-green-600 bg-green-50 text-green-600' : ''}
								${step.state === 'active' ? 'border-blue-600 bg-blue-50 text-blue-600 scale-110 shadow-sm' : ''}
								${step.state === 'pending' ? 'border-gray-200 text-gray-300' : ''}
							`}>
								{#if step.state === 'completed'}
									<Icon icon="heroicons:check-16-solid" class="h-3 w-3" />
								{:else if step.state === 'active'}
									<span class="h-1.5 w-1.5 rounded-full bg-blue-600 animate-ping"></span>
								{:else}
									<span class="h-1 w-1 rounded-full bg-gray-200"></span>
								{/if}
							</span>

							<div class="space-y-0.5">
								<h4 class={`text-sm font-semibold transition-colors ${step.state === 'active' ? 'text-blue-700' : step.state === 'completed' ? 'text-gray-800' : 'text-gray-400'}`}>
									{step.title}
								</h4>
								<p class="text-xs text-gray-500">{step.description}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Kolom Kanan: Aksi Cepat & Panduan (Lebar 1/3) -->
			<div class="lg:col-span-1 space-y-6">
				<!-- Panel Aksi Cepat (Identik dengan QuickActionPanel Admin) -->
				<QuickActionPanel />

				<!-- Panduan Penulis -->
				<div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
					<h3 class="text-lg font-bold text-gray-800 flex items-center gap-2">
						<Icon icon="heroicons:information-circle" class="h-5 w-5 text-blue-600" />
						Panduan Penulis
					</h3>
					<p class="text-xs text-gray-600 leading-relaxed">
						Bagi penulis terpilih, harap mengunduh buku panduan hibah serta template naskah format *.docx untuk
						menyesuaikan kelayakan tulisan Anda sebelum dievaluasi.
					</p>

					<div class="space-y-2">
						<a 
							href="#" 
							class="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-700 transition-all"
						>
							<span class="flex items-center gap-2 text-xs">
								<Icon icon="heroicons:document-text" class="h-4.5 w-4.5 text-blue-600" />
								Panduan Penulisan.pdf
							</span>
							<Icon icon="heroicons:arrow-down-tray" class="h-4 w-4" />
						</a>
						<a 
							href="#" 
							class="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-700 transition-all"
						>
							<span class="flex items-center gap-2 text-xs">
								<Icon icon="heroicons:document-arrow-up" class="h-4.5 w-4.5 text-blue-600" />
								Template Naskah.docx
							</span>
							<Icon icon="heroicons:arrow-down-tray" class="h-4 w-4" />
						</a>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
