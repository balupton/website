		<div class="search">
		
			<div class="search_intro">
			Welcome to Search
			</div>
		
			<div class="search_content">
			
			{if !isset($results) }{assign var='results' value=3}{/if}
			{section name="result" loop=$results}
				{include file="page/search/result.tpl"}
			{/section}
				
			</div>
			
			<div class="search_outro">
			Goodbye from Search
			</div>
		
		</div>
		
		<script type="text/javascript">alert('You searched for: {$query|default:"Unknown"}');</script>